


// this is the server script
const express = require("express")
const app = express()

// set the template engine ejs
app.set("view engine", "ejs")

// middlewares
app.use(express.static("public"))

// routes
app.get("/", (req, res) => {
  res.render("index")
})

// listen on port 3001
const hostname = "127.0.0.1"
const port = 3000

// create server
server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})


// create socket.io
const io = require("socket.io")(server)

// socket.io listener
io.on('connection', (socket) => {
  console.log('client connected: ' + socket.id)
  
  // socket name defaulted to its id
  socket.name = socket.id

  // on receiving messages
  socket.on('msg', (data) => {
    console.log(data.msg)
    // broadcast the new message
    io.sockets.emit('new_msg', {username: socket.name, message: data.msg })
  })

  // on receiving name changes
  socket.on('changename', (data) => {
    console.log(socket.name + "changed name to: " + data.newname)
    socket.name = data.newname
    
  })

  // on client typing 
  socket.on('typing', (data) => {
    // broadcast message to all the connected clients
    socket.broadcast.emit('typing', {username: socket.name})
  })



})

