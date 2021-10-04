
// Connnect to Mongoose




const express = require("express")
const app = express()
const mongoose = require("mongoose")



const connectionString = "mongodb://localhost:27017/admin"   

// connect to mongo db
mongoose.connect(connectionString, { useNewUrlParser: true}  )
.then(
  () => {console.log("Mongoose connected successfully")},                // connected
  err => {console.log("Mongoose could not connect to database" + err)} // econnection error

)
const UEvent = require("./models/UserEvent")
const Record =  require("./models/ChatRecord")





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


// get current time function
let GetCurrTime = () => {
  return new Date().toLocaleString()
}





// create socket.io
const io = require("socket.io")(server)

// socket.io listener
io.on('connection', (socket) => {
  // run everytime  client connect (connection event)
  console.log('client connected: ' + socket.id)

  
  // socket name defaulted to its id
  socket.name = socket.id
  
  // implement user connection event push to db
  let  newEvent  = new UEvent({
    user_name:socket.name,
    event:"user connected",
    eventDesc:"user  connected to the server",
    time:GetCurrTime()
    
  })


  newEvent.save().then((result) => {
    console.log(result)
    
  }).catch((err) => {
    console.log(err)
  })

  // join room event
  socket.on('changeroom', (data) => {
    console.log(data.room)

    
    // push user event change room to db
    let newEvent = new UEvent({
      user_name:socket.name,
      event:"user changeroom",
      eventDesc:`${socket.name} changed to room ${data.room}`,
      time:GetCurrTime()
      
    })
      
    newEvent.save().then((result) => {
      console.log(result)
      
    }).catch((err) => {
      console.log(err)
    })

    // send message to previous room if the user already connected 
    if (socket.room_id) {
      io.to(socket.room_id).emit('user_left', {username: socket.name, room: socket.room_id})
      socket.leave(socket.room_id)

    }

    // save room index to socket objects
    socket.room_id = data.room

    // let the socket joins target room
    socket.join(socket.room_id)

    // send message to the new room
    io.to(socket.room_id).emit('user_entered', {username: socket.name, room: socket.room_id})

  })





  // on receiving messages
  socket.on('msg', (data) => {
    console.log(data.msg)
    // broadcast the new message to all the client
    io.to(socket.room_id).emit('new_msg', {username: socket.name, message: data.msg })

    // implement push chat record to db
    let newRecord = new Record({
      user_name:  socket.name,
      msg:  data.msg,
      room: socket.room_id,
      time:GetCurrTime(),
      socket_id: socket.id

    })



    newRecord.save().then((result) => {
      console.log(result)
      
    }).catch((err) => {
      console.log(err)
    })




  })

  // on receiving name changes
  socket.on('changename', (data) => {
    console.log(socket.name + "changed name to: " + data.newname)
  
    
    // implement push user event to db
    let newEvent = new UEvent({
      user_name:socket.name,
      event:  "user  channnged name",
      eventDesc:`${socket.name} changed name to ${data.newname}`,
      time: GetCurrTime()
      
    })
      
    newEvent.save().then((result) => {
      console.log(result)
      
    }).catch((err) => {
      console.log(err)
    })

    // user name changed
    socket.name = data.newname

  })

  // on client typing 
  // socket.on('typing', (data) => {
  //   // broadcast message to all the connected clients
  //   socket.broadcast.emit('typing', {username: socket.name})
  // })

  socket.on("disconnect", () =>  {
    console.log("Disconnected...")

    if (socket.room_id) {
      io.to(socket.room_id).emit('user_left', {username: socket.name})
      socket.leave(socket.room_id)
    }

    let newEvent = new UEvent({
      user_name:socket.name,
      event:"user disconnected",
      eventDesc:"user  disconnected to the server",
      time:GetCurrTime()
      
    })
      
    newEvent.save().then((result) => {
      console.log(result)
      
    }).catch((err) => {
      console.log(err)
    })
  
  })

    
})

