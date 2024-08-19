const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const socketIoRedis = require('socket.io-redis');

// Create an Express application
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Redis setup
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisUser = process.env.REDIS_USER || 'default'
const redisPassword = process.env.REDIS_PASSWORD || 'redis'

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  username: redisUser,
  password: redisPassword,
});

const redisAdapter = socketIoRedis({
  host: redisHost,
  port: redisPort,
});

io.adapter(redisAdapter);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('message', (msg) => {
    console.log('message: ' + msg);
    io.emit('message', msg); // Broadcast message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
