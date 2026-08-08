require("dotenv").config()
const http = require('http')
const app = require("./src/app")
const {Server} = require('socket.io')
const initializeSocket = require("./src/sockets")

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin:process.env.CLIENT_URL,
        credentials: true
    }
})

app.set("io",io)
initializeSocket(io)

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

