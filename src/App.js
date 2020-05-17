import React from 'react';
import './App.css';

class Huhu extends React.Component {
  render() {
    return (<h2>Tach zusammen </h2>);
  }
}

function App() {
  return (
    <div>
      <h1>Hallo Welt</h1>
      <Huhu/>
    </div>
  );
}

export default App;
