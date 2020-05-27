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

let callBtn = null;
let copyBtn = null;
let sendBtn = null;
let adrLnk = null;
let drawBtn = null;
let chatBtn = null;

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
		let txt = document.getElementById('chatTxt');
		txt.value = data;
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
				<canvas id="mainDrawArea" style={{zIndex: this.state.draw_z}}/>
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
