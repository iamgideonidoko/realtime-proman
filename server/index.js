const 
    { Server } = require('socket.io'),
    origin = 'http://localhost:3000',
    io = new Server({
        cors: { origin }
    });
// data will be persisted here
let persistedData = null;
io.on('connection', (socket) => {
    console.log(`New connection ID: ${socket.id}`);
    socket.emit('just-joined', persistedData ?? {});
    socket.on('data-change', (data) => {
        persistedData = data;
        socket.broadcast.emit('new-data-change', data);
    })
});
io.listen(5000);
console.log(`🚀 socket server started on port 5000...`);