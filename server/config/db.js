import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
