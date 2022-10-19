const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();
const origin = 'http://localhost:3000';
app.use(cors({ origin, credentials: true }));
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: { origin }
});
let persistedStore = null;
io.on('connection', (socket) => {
    console.log(`New client with ID: ${socket.id}`);
    console.log('store => ', persistedStore);
    if (persistedStore) socket.emit('just-joined', persistedStore);
    socket.on('data-change', (msg) => {
        persistedStore = msg;
        socket.broadcast.emit('new-data-change', msg);
    })
})
const port = process.env.PORT || 5000;
httpServer.listen({ port }, () => console.log(`🚀 server started on port: ${port}`) )