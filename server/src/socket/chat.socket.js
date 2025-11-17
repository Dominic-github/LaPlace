export default function chatSocket(socket, io) {
  console.log('Chat connected:', socket.id)

  socket.on('join-chat', (room) => {
    socket.join(room)
    console.log('User joined chat room:', room)
  })

  socket.on('sendMessage', (data) => {
    io.of('/chat').to(data.room).emit('receiveMessage', data)
  })

  socket.on('disconnect', () => {
    console.log('Chat disconnected:', socket.id)
  })
}
