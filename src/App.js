/*
TODO: onDisconnect handling
TODO: isInitiator aufräumen und aus setState umbauen
*/
import React from 'react';
import './App.css';
import './setupPeer';
import { setupPeer, getDataCon, getCamCon } from './setupPeer';
import { remoteIdKnown } from './webrtc/remoteIdKnown';

let callBtn = null;
let copyBtn = null;
let sendBtn = null;
let adrLnk = null;

class ConnectionPanel extends React.Component {
  constructor() {
    super();

    this.state = {
      ouradr : 'keine Ahnung'
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
		alert(data);
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
		console.log(this.isInitiator);

		if (this.isInitiator) {
			panel = (
				<div className='InitiatorPanel'>
					<input type="text" className="ouradr" id="adrlnk" value={this.state.ouradr} readOnly />
					<button id="copy" disabled>
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
	render() {
		return (
			<div id='content'>
				<ConnectionPanel/>
				<canvas id="mainDrawArea" />
				<div className="videos">
					<video id="rVideo" className="video" muted autoPlay />
					<video id="lVideo" className="video" muted autoPlay />
				</div>
			</div>
		);
	}
}

function App() {
	return <PlayGround />;
}

export default App;
