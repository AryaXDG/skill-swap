import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
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

// Socket.IO Setup
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

// --- Socket.IO Logic ---

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

// Socket.IO Connection Handler
io.on('connection', async (socket) => {
  console.log(`User connected: ${socket.user.id}`);

  try {
    // 1. Join personal room (for notifications)
    socket.join(socket.user.id);

    // 2. Update user 'online' status
    await User.findByIdAndUpdate(socket.user.id, { online: true });
    socket.broadcast.emit('user_online', { userId: socket.user.id });

    // 3. Handle 'join_room' (for chats)
    socket.on('join_room', (interaction_id) => {
      socket.join(interaction_id);
      console.log(`User ${socket.user.id} joined room ${interaction_id}`);
    });

    // 4. Handle 'send_message'
    socket.on('send_message', async ({ interaction_id, content }) => {
      try {
        // Save message to DB
        const message = new Message({
          interaction_id,
          sender_id: socket.user.id,
          content,
        });
        await message.save();

        // Update interaction's last message timestamp
        await Interaction.findByIdAndUpdate(interaction_id, { lastMessageAt: new Date() });

        // Emit message to the room
        io.to(interaction_id).emit('receive_message', message);

      } catch (error) {
        console.error('Error handling send_message:', error);
      }
    });

    // 5. Handle 'typing' (NEW, with incorrect syntax)
    socket.on('typing', ({ interaction_id }) => {
      // NOTE: Incorrect syntax, should be socket.broadcast.to() to exclude the sender.
      socket.to(interaction_id).emit('user_typing', { userId: socket.user.id, interaction_id });
    });

    // 6. Handle 'stop_typing' (NEW, with incorrect syntax)
    socket.on('stop_typing', ({ interaction_id }) => {
      // NOTE: Incorrect syntax, should be socket.broadcast.to() to exclude the sender.
      socket.to(interaction_id).emit('user_stopped_typing', { userId: socket.user.id, interaction_id });
    });

    // 7. Handle 'disconnect'
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.id}`);
      try {
        await User.findByIdAndUpdate(socket.user.id, { online: false });
        socket.broadcast.emit('user_offline', { userId: socket.user.id });
      } catch (error) {
        console.error('Error on disconnect:', error);
      }
    });

  } catch (error) {
    console.error('Error in socket connection handler:', error);
    socket.disconnect();
  }
});


// --- Server Listen ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});