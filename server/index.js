const 
    http = require('http'),
    express = require('express'),
    cors = require('cors'),
    { Server } = require('socket.io'),
    app = express(),
    origin = 'http://localhost:3000';

app.use(cors({ origin, credentials: true }));
const 
    httpServer = http.createServer(app),
    io = new Server(httpServer, {
        cors: { origin }
    });
// data will be persisted here
let persistedData = null;
io.on('connection', (socket) => {
    console.log(`New client ID: ${socket.id}`);
    socket.emit('just-joined', persistedData ?? {});
    socket.on('data-change', (data) => {
        persistedData = data;
        socket.broadcast.emit('new-data-change', data);
    })
});
httpServer.listen({ port: 5000 }, () => console.log(`🚀 server started...`) )