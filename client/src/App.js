import React from 'react';
import './App.css';
import Places from './components/Places'

function App() {
  return (
    <div id="container">
      <h2>Hiking Tracker</h2>
      <Places />
      <button id="saveLocationButton">SAVE</button>
    </div>
  );
}

export default App;
