import React from 'react';
import './App.css';

class PlayGround extends React.Component {
  render() {
    return (
      <div>
        <canvas></canvas>
        <div className="videos">
          <video className="video"></video>
          <video className="video"></video>
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
