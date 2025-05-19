import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; // NEW Import
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Load Env
dotenv.config();

// DB Connect
import connectDB from './config/db.js';
connectDB();

// Models
import User from './models/User.js';
import Skill from './models/Skill.js';
import Interaction from './models/Interaction.js';
import Message from './models/Message.js';
import Rating from './models/Rating.js';

// Routes
import authRoutes from './routes/authRoutes.js'; 
import skillRoutes from './routes/skillRoutes.js'; 
import userRoutes from './routes/userRoutes.js'; 
import interactionRoutes from './routes/interactionRoutes.js'; 
import messageRoutes from './routes/messageRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

// --- DEFINE CLIENT URL WITH FALLBACK ---
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();
const server = http.createServer(app);

// Socket.IO Setup (NEW)
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: CLIENT_URL,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/skills', skillRoutes); 
app.use('/api/interactions', interactionRoutes); 
app.use('/api/messages', messageRoutes);
app.use('/api/ratings', ratingRoutes);

// --- Socket.IO Logic (NEW) ---

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: No token provided.'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attaches { id: userId } to socket
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token.'));
  }
});

// Placeholder for connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.id}`);
  // No further logic yet
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.id}`);
  });
});


// --- Server Listen ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});