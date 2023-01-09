const rooms = require('../rooms');
const sendUpdateToAll = require('../Utility/sendUpdateToAll');

module.exports = function createRoom({name}, id, io) {
    console.log(name);
    const roomID = Math.random().toString(36).substring(2, 7).toUpperCase();
    rooms[roomID] = {
        teacher: {
            name: name || `Player-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            socketID: id
        },
        students: [],
        roomID: roomID,
        question: {
            ques: null,
            options: null,
            correctAns: null,
            quesEndTime: null
        }
    };

    console.log('ROOM CREATED :', rooms[roomID]);
    io.to(id).emit("roomCreated", { roomID, playerName: rooms[roomID].teacher.name });
}