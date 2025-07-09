const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let messageHistory = []; // 🧠 Save messages in memory

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send all old messages to the new client
  socket.emit('message_history', messageHistory);

  // When a message is sent
  socket.on('send_message', (data) => {
    messageHistory.push(data); // Save the message
    io.emit('receive_message', data); // Send to all users
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});