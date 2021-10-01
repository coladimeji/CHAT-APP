

const mongoose = require("mongoose")


// order schema
const ChatRecordSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    socket_id: {
        type: String,
        required: true
    }
})

const collection = "ChatRecord"
const Record = mongoose.model('ChatRecord', ChatRecordSchema, collection)
module.exports = Record