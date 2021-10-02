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
  
    console.log("chat.js mounted")



    // socket io key word:
    // "msg": {msg} client message
    // "changename": {newname} client name change



    // send message button function
    send_message.click(() => {
  
      // send message null check
      if (message.val() == '') {
        return
      }
  
      // send new message object to server
      socket.emit('msg', {msg: message.val()})
      console.log("message sent")
  
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
  

    // receiving new messages
    socket.on('new_msg', (data) => {
      // append html element to the chatroom
      chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
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