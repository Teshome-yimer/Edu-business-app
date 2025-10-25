const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edu-business', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

// Socket.io for real-time features
const activeRooms = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Live classes
    socket.on('join-class', (data) => {
        const { roomId, userId, userName, isTutor } = data;
        socket.join(roomId);

        if (!activeRooms.has(roomId)) {
            activeRooms.set(roomId, new Map());
        }

        const room = activeRooms.get(roomId);
        room.set(socket.id, { userId, userName, isTutor });

        socket.to(roomId).emit('user-joined', { userId, userName, isTutor });
        socket.emit('current-participants', Array.from(room.values()));
    });

    // WebRTC signaling
    socket.on('offer', (data) => {
        socket.to(data.roomId).emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.to(data.roomId).emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
        socket.to(data.roomId).emit('ice-candidate', data);
    });

    // Chat messages
    socket.on('send-message', (data) => {
        io.to(data.roomId).emit('new-message', {
            ...data,
            timestamp: new Date()
        });
    });

    // Notifications
    socket.on('subscribe-to-notifications', (userId) => {
        socket.join(`user-${userId}`);
    });

    socket.on('disconnect', () => {
        activeRooms.forEach((room, roomId) => {
            if (room.has(socket.id)) {
                room.delete(socket.id);
                socket.to(roomId).emit('user-left', { socketId: socket.id });
                if (room.size === 0) activeRooms.delete(roomId);
            }
        });
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };