import React from 'react';
import './App.css';
import './webrtc/'

class PlayGround extends React.Component {
  render() {
    return (
      <div>
        <canvas></canvas>
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
    // <h1>Tach</h1>
    <PlayGround />
  );
}

export default App;
