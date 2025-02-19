import 'reflect-metadata';
import { Server } from 'socket.io';

const io = new Server();

io.on('connection', (socket) => {
    console.log('a user connected');
});

io.on('disconnect', () => {
    console.log('a user disconnected');
});

io.listen(3000);
console.log('listening on *:3000');
