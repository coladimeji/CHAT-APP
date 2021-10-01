

const mongoose = require("mongoose")


// order schema
const UserEventSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    eventDesc: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
})

const collection = "UserEvent"
const UEvent = mongoose.model('UserEvent', UserEventSchema, collection)
module.exports = UEvent