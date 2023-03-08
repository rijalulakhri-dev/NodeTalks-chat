const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const { username, room } =  Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

// dapatkan room dan user
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room),
    outputUsers(users)
})

// masuk ke obrolan
socket.emit('joinRoom', ({ username, room }))

// pesan dari server
socket.on('message', message => {
    console.log(message);
    outputMessage(message)

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

    // pesan masuk
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // dapatkan pesan text
    const msg = e.target.elements.msg.value

    // emit pesan ke server
    socket.emit('chatMessage', msg)

    // hapus isi pesan setelah mengirim
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()


})


    // outputMessage ke DOM
    function outputMessage(message) {
        const div = document.createElement('div')
        div.classList.add('message')
        div.innerHTML = `<p class="meta">${message.username}<span> ${message.time}</span></p>
        <p class="text">${message.text}</p>`
        
        document.querySelector('.chat-messages').appendChild(div)
    }

    // tambah room ke DOM
    function outputRoomName(room) {
        roomName.innerText = room
    }

    function outputUsers(users) {
        userList.innerHTML = `${users.map(user =>  `<li>${user.username}</li>`).join('')}`
    }