/*
TODO: ScreenShare
*/
import React from 'react';
import './App.css';
import './setupPeer';
import { getCamCon, getDataCon, setupPeer } from './setupPeer';
import { remoteIdKnown } from './webrtc/remoteIdKnown';
import TextChat from './textchat';
import DataCom from './datacom';
import { ScreenShare } from './screenshare';

let callBtn = null;
let copyBtn = null;
let sendBtn = null;
let adrLnk = null;
let drawBtn = null;
let chatBtn = null;
let screenBtn = null;
let lastX = 0;
let lastY = 0;
let points=[];
let isDrawing = false;
var canvas = null;
var ctx = null;

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
		if(data.data.type==='DrawPoints' && data.data.widget==='Canvas') {
			const px = canvas.getBoundingClientRect().width;
			const py = canvas.getBoundingClientRect().height;
			// canvas.width = px;
			// canvas.height = py;
			ctx.lineWidth=1;


			data.data.points.forEach((point, index) => {
				var x = point[0]*px;
				var y = point[1]*py;
				if(index === 0) {
					ctx.moveTo(x, y)
				}
				else {
					ctx.lineTo(x,y)
					ctx.stroke();
				}
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
		window.addEventListener('resize', () => {
			canvas = document.getElementById('mainDrawArea');
			ctx = canvas.getContext("2d");
			canvas.width = canvas.getBoundingClientRect().width;
			canvas.height = canvas.getBoundingClientRect().height;
			console.log('Resize');
		})
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
		  draw_z : 1,
		  screen_z : 1,
		}
	}

	onCanvasMouseMove(event) {
		const px = canvas.getBoundingClientRect().width;
		const py = canvas.getBoundingClientRect().height;
		
		ctx.lineWidth=1;

		if(!isDrawing) {
			return;
		}
		let x = event.nativeEvent.offsetX;
		let y = event.nativeEvent.offsetY;
		
		ctx.moveTo(lastX,lastY);
		ctx.lineTo(x,y)
		ctx.stroke();
		lastX = x;
		lastY = y;
		points.push([x/px,y/py]);
	}

	onCanvasMouseDown(event) {
		const px = canvas.getBoundingClientRect().width;
		const py = canvas.getBoundingClientRect().height;
		// canvas.width = px;
		// canvas.height = py;
		
		isDrawing = true;
		let data = new DataCom();
		data.data.type = 'MouseDown';
		data.data.widget = 'Canvas';
		data.data.x = event.nativeEvent.offsetX;
		data.data.y = event.nativeEvent.offsetY;
		lastX = data.data.x;
		lastY = data.data.y;
		console.log('Down at '+lastX+','+lastY);
		points.push([lastX/px, lastY/py]);
		getDataCon().send(data);
	}
	
	onCanvasMouseUp(event) {
		isDrawing = false;
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
		const px = canvas.getBoundingClientRect().width;
		const py = canvas.getBoundingClientRect().height;
		canvas.width = px;
		canvas.height = py;

		document.getElementById('mainDrawArea').style.zIndex = 1000;
		document.getElementById('ScreenShare').style.zIndex = 1;
		document.getElementById('textchat').style.zIndex = 1;
		this.setState({
			chat_z : 1,
			draw_z : 1000,
			screen_z : 1
		});
		console.log('Canvas active');
	}	

	activateChat() {
		document.getElementById('mainDrawArea').style.zIndex = 1;
		document.getElementById('ScreenShare').style.zIndex = 1;
		document.getElementById('textchat').style.zIndex = 1000;
		this.setState({
			chat_z : 1000,
			draw_z : 1,
			screen_z : 1
		});
		console.log('Chat active');
	}
	
	async activateScreen() {
		let scrnVideo = document.getElementById('scrnVid');
		document.getElementById('mainDrawArea').style.zIndex = 1;
		document.getElementById('textchat').style.zIndex = 1;
		scrnVideo.style.zIndex = 1000;
		
		this.setState({
			chat_z : 1,
			draw_z : 1,
			screen_z : 1000});
		await window.ScreenShare.startCapture();
		console.log('Screenshare active');

		let ScreenShareDiv = document.getElementById('ScreenShare');
		console.log(ScreenShareDiv.getBoundingClientRect().width);
		console.log(ScreenShareDiv.getBoundingClientRect().height);
		ScreenShareDiv.width = scrnVideo.getBoundingClientRect().width;
		ScreenShareDiv.height = scrnVideo.getBoundingClientRect().height;
		scrnVideo.width = ScreenShareDiv.width;
		scrnVideo.height = ScreenShareDiv.height;
		
	}

	componentDidMount() {
		drawBtn = document.getElementById('drawingBtn');
		chatBtn = document.getElementById('textChatBtn');
		screenBtn = document.getElementById('screenBtn');
		drawBtn.addEventListener('click', () => this.activateCanvas());
		chatBtn.addEventListener('click', () => this.activateChat());
		screenBtn.addEventListener('click', () => this.activateScreen());
		canvas = document.getElementById('mainDrawArea');
		ctx = canvas.getContext("2d");
		this.activateCanvas();
		this.activateChat();
	}

	render() {
		return (
			<div id='content'>
				<ConnectionPanel/>
				<canvas id="mainDrawArea" 
					style={{zIndex: this.state.draw_z}}
					onMouseDown={this.onCanvasMouseDown}
					onMouseUp={this.onCanvasMouseUp}
					onMouseOut={this.onCanvasMouseUp}
					onMouseMove={this.onCanvasMouseMove}/>
				<div className="videos">
					<video id="rVideo" className="video" autoPlay />
					<video id="lVideo" className="video" muted autoPlay />
				</div>
				<button id="textChatBtn">TextChat</button>
				<button id="drawingBtn">Drawing</button>
				<button id="screenBtn">Screen</button>
				<TextChat style={{zIndex: this.state.chat_z}}/>
				<ScreenShare style={{zIndex: this.state.screen_z}} />
			</div>
		);
	}
}

function App() {
	return <PlayGround />;
}

export default App;
