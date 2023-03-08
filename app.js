const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const port = 3000
const server = http.createServer(app)
const io = socketio(server)
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

 app.use(express.static('public'))

 const botName = 'Red Hat' 


// akan berjalan saat user terkoneksi
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room )
    
        socket.join(user.room)


    // pesan selamat datang 
    socket.emit('message', formatMessage(botName,'Selamat datang di Redhat'))

    // pesan broadcast ketika user terkoneksi
    socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`))

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    // ambil pesan dari chatMessage
    socket.on('chatMessage', msg => {

        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
    
    // pesan saat terputus koneksi
    socket.on('disconnect', () => {

        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))
        
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
            
        }
    })
})


app.get('/', (req, res) => res.send('Hello World!'))
server.listen(port, () => console.log(`Example app listening on port ${port}!`))