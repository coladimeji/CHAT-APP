
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
    time:new Date().getTime()
    
  })


  newEvent.save().then((result) => {
    console.log(result)
    
  }).catch((err) => {
    console.log(err)
  })

  // on receiving messages
  socket.on('msg', (data) => {
    console.log(data.msg)
    // broadcast the new message to all the client
    io.sockets.emit('new_msg', {username: socket.name, message: data.msg })

    // implement push chat record to db
    let newRecord = new Record({
      user_name:  socket.name,
      msg:  data.msg,
      room:0,
      time:new Date ().getTime(),
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
      time:new Date().getTime()
      
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

    let newEvent = new UEvent({
      user_name:socket.name,
      event:"user disconnected",
      eventDesc:"user  disconnected to the server",
      time:new Date().getTime()
      
    })
      
    newEvent.save().then((result) => {
      console.log(result)
      
    }).catch((err) => {
      console.log(err)
    })
  
  })

    
})

