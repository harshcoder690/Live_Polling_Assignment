const rooms = require('../rooms');
const sendUpdateToAll = require('../Utility/sendUpdateToAll');

module.exports = function questionReset({roomID}, id, io) {
    if(!roomID || !rooms[roomID] || rooms[roomID].teacher.socketID != id) return io.to(id).emit("failed", { msg: "Invalid action" });
    const room = rooms[roomID];
  
    if(room.question.ques != null && room.question.totalVotes < room.students.length) return io.to(id).emit("failed", { msg: "Wait for all students to answer" });
  
    room.question = {
        ques: null,
        options: null,
        correctAns: null,
        quesEndTime: null,
    }
  
    console.log(room);
  
    sendUpdateToAll(room, 'questionResetDone', null, id, io);
    sendUpdateToAll(room, 'questionUpdated', room.question, id, io);
}