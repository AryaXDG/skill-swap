import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

// Load Env
dotenv.config();

// DB Connect
import connectDB from './config/db.js';
connectDB();

// Models
import User from './models/User.js';
import Skill from './models/Skill.js'; // New Import

// --- DEFINE CLIENT URL WITH FALLBACK ---
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: CLIENT_URL,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Server Listen ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});