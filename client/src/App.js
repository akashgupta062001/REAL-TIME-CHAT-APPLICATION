import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css'; // 🔥 Make sure this line is included

const socket = io("http://localhost:3001");

function App() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on('message_history', (history) => {
      setChat(history);
    });

    socket.on('receive_message', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    return () => {
      socket.off('message_history');
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit('send_message', message);
      setMessage("");
    }
  };

  return (
    <div className="app">
      <h2>💬 Real-Time Chat</h2>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div className="chat-message" key={index}>{msg}</div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;