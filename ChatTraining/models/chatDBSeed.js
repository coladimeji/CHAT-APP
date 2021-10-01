
use('admin')

db.getCollection("ChatRecord").insertMany([
    {
        "user_name": "John",
        "msg": "Hello",
        "room": "1",
        "time": "0",
        "socket_id": "123"
    },
    {
        "user_name": "Jack",
        "msg": "Hello",
        "room": "2",
        "time": "0",
        "socket_id": "234"
    }
])
