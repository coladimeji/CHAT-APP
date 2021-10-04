
$(() => {

    // make socket io connection
    let socket = io.connect('http://127.0.0.1:3000')
  
    // buttons and inputs
    let message = $("#message")
    let username = $("#username")
    let send_message = $("#send_message")
    let send_username = $("#send_username")
    let chatroom = $("#chatroom")
    let feedback = $("#feedback")
    let room = $("#room")
    let send_roomid = $("#send_roomid")
    let discButton = $("#send_disconnect")


    console.log("chat.js mounted")

    // room index
    let room_id = room.prop('selectedIndex')
    // user name
    // let user_name = ""




    // update room id and send to server
    let UpdateRoomID = () => {

      // refresh room id
      room_id = room.prop('selectedIndex') + 1

      // send new room id to the server
      // require data from data base
      socket.emit('changeroom', {room: room_id})
      // server need to diplay leave and enter message
      console.log(room_id)

      chatroom.empty()
    }

    UpdateRoomID()

    // set room id on click
    send_roomid.click(UpdateRoomID)



    // client key word:
    // "msg": {msg} client message
    // "changename": {newname} client name change
    
    // server key word
    // "chat_room_history"
    // "user_enters"
    // "user_leaves"


    // send message button function
    send_message.click(() => {
  
      // send message null check
      if (message.val() == '') {
        return
      }
  
      // send new message object to server
      socket.emit('msg', {msg: message.val()})
      console.log("message sent")
      console.log(room_id)

    })


    // change username button function
    send_username.click(() => {
  
      // null check
      if (username.val() == '') {
        return
      }
      
      // send new name object to server
      socket.emit('changename', {newname: username.val()})
      console.log("name changed to: " + username.val())
  
    })
  

    // disconnect button
    discButton.click(() => {
      socket.disconnect()
      console.log("disconnect");

    })










    // socket io stuff
    // receiving new messages
    socket.on('new_msg', (data) => {
      // append html element to the chatroom
      chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
    })
  



    // on receiving target room history
    socket.on('chat_room_history', (data) => {

      // for each history from database, append html element to chatroom
      // data.forEach(element => {
      //   // clear caht history 

      //   // append html element to the chatroom
      //   chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
        
      // })

    })



    // user enter chat room
    socket.on('user_entered', (data) => {
      chatroom.append("<p class='message'>" + data.username + " Entered Chat Room " + data.room + "</p>")
    })


    // user leave chat room
    socket.on('user_left', (data) => {
      chatroom.append("<p class='message'>" + data.username + " Left Chat Room " + data.room + "</p>")
    })




    // xxx is typing notification
    // inform the server if typing
    // message.bind('keypress', () => {
    //   socket.emit('typing')
    // })
  
    // listen for others typing
    // socket.on('typing', (data) => {
    //   feedback.html("<p><i>" + data.username + "is typing a message ... " + "</i></p>")
    // })
  
  
  })