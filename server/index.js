const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('../config.json');
const port = config.BACKEND_PORT;
const routes = require('./router/routes');
const cors = require('cors');
const mongoose = require("mongoose");
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');

// Enable CORS for all routes
app.use(cors());

const io = socketIo(server, {
  cors: {
    origin: `http://${config.FRONTEND_HOST}:${config.FRONTEND_PORT}`,
    credentials: true
  },
});

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// MongoDB connection
mongoose.set('strictQuery', false);
const dbURI = `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;
const dbConnection = mongoose.connection;

dbConnection.on("disconnected", () => {
  setTimeout(() => {
    connectToMongoDB(dbURI);
  }, 5000);
});

dbConnection.on("reconnected", () => {
  console.log(`DB reconnected to ${dbURI}`);
});

dbConnection.once("open", () => {
  console.log(`Connected successfully to DB ${dbURI}`);
});

connectToMongoDB(dbURI);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for incoming messages
  socket.on('sendMessage', async (message) => {
    console.log("sendMessage: ", message)
    io.emit('receiveMessage', message);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(config.BASE_URI, routes)

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function connectToMongoDB(uri) {
  mongoose.connect(uri)
  .catch(err => {
    console.log(`Failed to connect to DB ${uri}: ${err}`)
  })
}