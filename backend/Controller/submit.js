const rooms = require('../rooms');
const sendUpdateToAll = require('../Utility/sendUpdateToAll');

module.exports = function submit({roomID, choosedAns}, id, io) {
    if(!roomID || !rooms[roomID]) return io.to(id).emit("failed", { msg: "Invalid action" });
    const room = rooms[roomID];
  
    if(choosedAns > room.question.options.length || choosedAns <= 0) return io.to(id).emit("failed", { msg: "Choose an option" });
  
    room.question.totalVotes++;
    room.question.options[choosedAns-1].count++;
  
    console.log(room.question);
  
    io.to(id).emit("submitted", {correctAns: room.question.correctAns});
    sendUpdateToAll(room, 'questionUpdated', room.question, id, io);
}