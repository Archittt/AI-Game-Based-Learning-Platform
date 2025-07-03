import './App.css';
import logo from './logo.svg';
import { useEffect } from 'react';
import socket from './socket';

function App() {
  const CURRENT_USER_ID = localStorage.getItem('userId'); // Or use context/state

  useEffect(() => {
    socket.on('new-notification', (data) => {
      if (data.userId === CURRENT_USER_ID) {
        alert(data.message); // You can replace with toast later
      }
    });

    return () => {
      socket.off('new-notification');
    };
  }, [CURRENT_USER_ID]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
