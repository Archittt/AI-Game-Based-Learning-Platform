import './App.css';
import logo from './logo.svg';
import { useEffect } from 'react';
import socket from './socket';

function App() {
  const CURRENT_USER_ID = localStorage.getItem('userId'); // Or use context/state

  useEffect(() => {
    // Join user's Socket.IO room
    if (CURRENT_USER_ID) {
      socket.emit('join', CURRENT_USER_ID);
    }

    // Listener for new-notification event
    socket.on('new-notification', (data) => {
      if (data.userId === CURRENT_USER_ID) {
        alert(data.message); // You can replace with toast later
      }
    });

    // Listener for achievement event
    socket.on('achievement', (data) => {
      if (data.type === 'quiz_completed') {
        alert(`Quiz ${data.challengeId} in module ${data.moduleId} completed! Earned ${data.points} points.`);
      } else if (data.type === 'module_completed') {
        alert(`Module ${data.moduleId} completed! Earned ${data.points} points.`);
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off('new-notification');
      socket.off('achievement');
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
