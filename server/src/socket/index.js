import chatSocket from './chat.socket.js'

export default function initSocket(io) {
  io.of('/chat').on('connection', (socket) => {
    chatSocket(socket, io)
  })
}
