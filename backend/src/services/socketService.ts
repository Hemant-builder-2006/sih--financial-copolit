import { Server, Socket } from 'socket.io';

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Join board room
    socket.on('join-board', (boardId: string) => {
      socket.join(`board-${boardId}`);
      console.log(`User ${socket.id} joined board ${boardId}`);
    });

    // Leave board room
    socket.on('leave-board', (boardId: string) => {
      socket.leave(`board-${boardId}`);
      console.log(`User ${socket.id} left board ${boardId}`);
    });

    // Handle node updates
    socket.on('node-update', (data: any) => {
      socket.to(`board-${data.boardId}`).emit('node-updated', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
