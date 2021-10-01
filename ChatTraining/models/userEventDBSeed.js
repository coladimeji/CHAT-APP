
use('admin')

db.getCollection("UserEvent").insertMany([
    {
        "user_name": "John",
        "event": "User Connect",
        "eventDesc": "User John Connected",
        "time": "0",
    },
    {
        "user_name": "Jack",
        "event": "User Changed Room",
        "eventDesc": "User Jack Connected",
        "time": "0",
    }
])
