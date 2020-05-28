/*
TODO: onDisconnect handling
TODO: isInitiator aufräumen und aus setState umbauen
*/
import React from 'react';
import './App.css';
import './setupPeer';
import { getCamCon, getDataCon, setupPeer } from './setupPeer';
import { remoteIdKnown } from './webrtc/remoteIdKnown';
import TextChat from './textchat';
import DataCom from './datacom';

let callBtn = null;
let copyBtn = null;
let sendBtn = null;
let adrLnk = null;
let drawBtn = null;
let chatBtn = null;
let lastX = 0;
let lastY = 0;
let points=[];

class ConnectionPanel extends React.Component {
  constructor() {
    super();

    this.state = {
	  ouradr : 'keine Ahnung',
	}
  }

	onAdrLink = (lnk) => {
    adrLnk.value = lnk;
    copyBtn.disabled = false;
    this.setState( {
      ouradr : lnk
    });
	}

	onDataConnection(conn) {
    if (this.isInitiator)
      sendBtn.disabled = false;
		callBtn.disabled = false;
	}

	onData(data) {
		if(data.data.type==='MouseDown' && data.data.widget==='Canvas') {
			console.log('Mouse Down at '+data.data.x+' '+data.data.y);
			
		}
		
		if(data.data.type==='DrawPoints' && data.data.widget==='Canvas') {
			var canvas = document.getElementById('mainDrawArea');
			var ctx = canvas.getContext("2d");
			const px = canvas.width/canvas.getBoundingClientRect().width;
			const py = canvas.height/canvas.getBoundingClientRect().height;
			ctx.scale(px,py);
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.lineWidth=py;

			data.data.points.forEach((point, index) => {
				var x = point[0];
				var y = point[1];
				if(index === 0) {
					ctx.moveTo(x*px, y*py)
				}
				else {
					ctx.lineTo(x*px,y*py)
					ctx.stroke();
				}
				console.log(point);
			});
			
			
		}
		
		if(data.data.type === 'Text' && data.data.widget==='TextChat') {
			let txt = document.getElementById('chatTxt');
			txt.value = data.data.text;
		}
	}

	lStrTo(stream) {
		const lVideo = document.getElementById('lVideo');
		lVideo.srcObject = stream;
	}

	rStrTo(stream) {
		const rVideo = document.getElementById('rVideo');
		rVideo.srcObject = stream;
	}

	onDisconnect() {
		callBtn.disabled = true;
		alert('Verbindungsabbruch');
	}

	makeCall() {
		getCamCon().call();
	}

  isInitiator = true;

	callbacks = {
		onAddressLink: this.onAdrLink,
		onDataConnection: this.onDataConnection,
		onData: this.onData,
		onDisconnect: this.onDisconnect,
		localStreamTo: this.lStrTo,
		remoteStreamTo: this.rStrTo
	};

	componentWillMount() {
    this.isInitiator = !remoteIdKnown();
    }
	
	componentDidMount() {
	callBtn = document.getElementById('call');
   	this.callbacks.onAdrLink = this.onAdrLink;
		if (this.isInitiator) {
			copyBtn = document.getElementById('copy');
			sendBtn = document.getElementById('send');
			adrLnk = document.getElementById('adrlnk');
			sendBtn.addEventListener('click', () => getDataCon().send('Wurst'));
			copyBtn.addEventListener('click', () => {
				adrLnk.select();
				document.execCommand('copy');
			});
		}
		callBtn.addEventListener('click', () => this.makeCall());
		
		setupPeer(this.callbacks);
	}

	render() {
		let panel;
		
		if (this.isInitiator) {
			panel = (
				<div className='InitiatorPanel'>
					<input type="text" className="ouradr" id="adrlnk" value={this.state.ouradr} readOnly />
					<button id="copy" className="cpyBtn" disabled>
						Kopie
					</button>
					<button id="send" disabled>
						Send
					</button>
				</div>
			);
		}

		return (
			<div className="ConnectionPanel">
				{panel}
				<button id="call" disabled className="callBtn">
					Anrufen
				</button>
			</div>
		);
	}
}

class PlayGround extends React.Component {
	constructor() {
		super();
	
		this.state = {
		  chat_z : 1,
		  draw_z : 1000
		}
	}

	onCanvasMouseMove(event) {
		var canvas = document.getElementById('mainDrawArea');
		var ctx = canvas.getContext("2d");
		const px = canvas.width/canvas.getBoundingClientRect().width;
		const py = canvas.height/canvas.getBoundingClientRect().height;
		ctx.scale(px,py);
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.lineWidth=py;

		if(event.nativeEvent.which===0)
			return;
		
		let x = event.nativeEvent.offsetX;
		let y = event.nativeEvent.offsetY;
		
		ctx.moveTo(lastX*px,lastY*py);
		ctx.lineTo(x*px,y*py)
		ctx.stroke();
		lastX = x;
		lastY = y;
		points.push([x,y]);
		console.log(points);
		
	}

	onCanvasMouseDown(event) {
		var canvas = document.getElementById('mainDrawArea');
		var ctx = canvas.getContext("2d");
		const px = canvas.width/canvas.getBoundingClientRect().width;
		const py = canvas.height/canvas.getBoundingClientRect().height;
		ctx.scale(px,py);
		ctx.setTransform(1, 0, 0, 1, 0, 0);

		let data = new DataCom();
		data.data.type = 'MouseDown';
		data.data.widget = 'Canvas';
		data.data.x = event.nativeEvent.offsetX;
		data.data.y = event.nativeEvent.offsetY;
		lastX = data.data.x;
		lastY = data.data.y;
		console.log('Down at '+lastX+','+lastY);
		points.push([lastX, lastY]);
		console.log(points);
		getDataCon().send(data);
	}
	
	onCanvasMouseUp(event) {
		let data = new DataCom();
		data.data.type = 'DrawPoints';
		data.data.widget = 'Canvas';
		data.data.points = points;
		data.data.x = event.nativeEvent.offsetX;
		data.data.y = event.nativeEvent.offsetY;
		getDataCon().send(data);
		points = [];
	}

	activateCanvas() {
		document.getElementById('mainDrawArea').style.zIndex = 1000;
		document.getElementsByTagName('textarea')[0].style.zIndex = 1;
		this.setState({chat_z : 1,
			draw_z : 1000});
		console.log('Canvas active');
	}	

	activateChat() {
		document.getElementById('mainDrawArea').style.zIndex = 1;
		document.getElementsByTagName('textarea')[0].style.zIndex = 1000;
		this.setState({chat_z : 1000,
			draw_z : 1});
		console.log('Chat active');
	}
	
	componentDidMount() {
		drawBtn = document.getElementById('drawing');
		chatBtn = document.getElementById('textChat');
		drawBtn.addEventListener('click', () => this.activateCanvas());
		chatBtn.addEventListener('click', () => this.activateChat());
	}

	render() {
		return (
			<div id='content'>
				<ConnectionPanel/>
				<canvas id="mainDrawArea" 
					style={{zIndex: this.state.draw_z}}
					onMouseDown={this.onCanvasMouseDown}
					onMouseUp={this.onCanvasMouseUp}
					onMouseMove={this.onCanvasMouseMove}/>
				<div className="videos">
					<video id="rVideo" className="video" autoPlay />
					<video id="lVideo" className="video" muted autoPlay />
				</div>
				<button id="textChat">TextChat</button>
				<button id="drawing">Drawing</button>
				<TextChat style={{zIndex: this.state.chat_z}}/>
			</div>
		);
	}
}

function App() {
	return <PlayGround />;
}

export default App;
