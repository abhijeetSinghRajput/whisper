import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: ['https://http://localhost:5173/'],
});

const onlineUsers = {};//userId : socketId

io.on('connect', (socket)=>{
    console.log('socket connected: ', socket.id);
    const { userId } = socket.handshake.query;
    onlineUsers[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(onlineUsers));

    socket.on('disconnect', ()=>{
        console.log('socket disconnected: ', socket.id);
        delete onlineUsers[userId];
        io.emit('getOnlineUsers', Object.keys(onlineUsers));
    })
})

export {io, app, server, onlineUsers};