const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a specific board room
    socket.on('board:join', (boardId) => {
      socket.join(boardId);
      console.log(`Socket ${socket.id} joined board ${boardId}`);
    });

    // Leave a specific board room
    socket.on('board:leave', (boardId) => {
      socket.leave(boardId);
      console.log(`Socket ${socket.id} left board ${boardId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = setupSockets;
