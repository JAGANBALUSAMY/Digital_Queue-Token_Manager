const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const SocketService = require('./services/socketService');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Initialize Socket Service
const socketService = new SocketService(io);

// Initialize Queue Status Service
const QueueStatusService = require('./services/queueStatusService');
const queueStatusService = new QueueStatusService(io);

// Initialize Notification Service
const NotificationService = require('./services/notificationService');
const notificationService = new NotificationService(io);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Q-Ease Backend API is running!' });
});

// Make io and services available to routes
app.set('io', io);
app.set('notificationService', notificationService);

// Import authentication middleware
const { auth } = require('./middleware/auth');

// API routes will be added here later
app.use('/api/auth', require('./routes/auth'));

// Protected routes
app.use('/api/users', auth, require('./routes/users'));
app.use('/api/organizations', auth, require('./routes/organizations'));
app.use('/api/organization-users', auth, require('./routes/organizationUsers'));
app.use('/api/queues', auth, require('./routes/queues'));
app.use('/api/tokens', auth, require('./routes/tokens'));
app.use('/api/announcements', auth, require('./routes/announcements'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = server;