import React from 'react';
import './App.css';

class PlayGround extends React.Component {
  render() {
    return (
      <div>
        <canvas></canvas>
        <video></video>
        <video></video>
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
