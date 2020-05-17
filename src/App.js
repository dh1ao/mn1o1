import React from 'react';
import './App.css';

class InitiatorPanel extends React.Component {
  render() {
    return(
      <div className="initiatorPanel">
        <input type="text" className="" id="adrlnk" readOnly></input>
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
