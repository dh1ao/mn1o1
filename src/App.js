import React from 'react';
import './App.css';
import './setupPeer';
import { setupPeer, 
  getDataCon,
  getCamCon } from './setupPeer';

let callBtn = null;
let copyBtn = null;
let sendBtn = null;
let adrLnk = null;

class InitiatorPanel extends React.Component {

  onAdrLink(lnk) {
    adrLnk.value = lnk;
    copyBtn.disabled = false; 
  }

  onDataConnection(conn) {
    sendBtn.disabled = false;
    callBtn.disabled = false;
}

  callbacks = {
    onAddressLink : this.onAdrLink,
    onDataConnection : this.onDataConnection
  }

  componentDidMount() {
    callBtn = document.getElementById('call');
    copyBtn = document.getElementById('copy');
    sendBtn = document.getElementById('send');
    adrLnk = document.getElementById('adrlnk');

    copyBtn.addEventListener('click', () => {
      adrLnk.select();
      document.execCommand("copy");
    })
    setupPeer(this.callbacks);
    
  }

  render() {
    return(
      <div className="initiatorPanel">
        <input type="text" className="ouradr" id="adrlnk" readOnly></input>
        <button id="copy"  disabled>Kopie</button>
        <button id="send" disabled>Send</button>
        <button id="call" disabled className='callBtn'>Anrufen</button>
      </div>
    );
  }
}

class PlayGround extends React.Component {
  rVideo = "rVideo";
  lVideo = "lVideo";
  
    render() {
    return (
      <div>
        <InitiatorPanel/>
        <canvas id='mainDrawArea'></canvas>
        <div className="videos">
          <video id="rVideo" className="video"></video>
          <video id="lVideo" className="video"></video>          
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <PlayGround />
  );
}

export default App;
