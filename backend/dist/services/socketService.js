"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('join-board', (boardId) => {
            socket.join(`board-${boardId}`);
            console.log(`User ${socket.id} joined board ${boardId}`);
        });
        socket.on('leave-board', (boardId) => {
            socket.leave(`board-${boardId}`);
            console.log(`User ${socket.id} left board ${boardId}`);
        });
        socket.on('node-update', (data) => {
            socket.to(`board-${data.boardId}`).emit('node-updated', data);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
exports.socketHandler = socketHandler;
//# sourceMappingURL=socketService.js.map