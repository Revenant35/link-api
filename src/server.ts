import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { PORT } from './config/config';
import { setupSocketHandlers } from './handlers/socketHandler';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('Socket.IO server is running');
});

setupSocketHandlers(io);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});