const rooms = require('../rooms');
const sendUpdateToAll = require('../Utility/sendUpdateToAll');

module.exports = function uploadQuestion(data, id, io) {
    const { roomID } = data;
    if(!roomID || !rooms[roomID]) return io.to(id).emit("failed", { msg: "Invalid action" });
    const room = rooms[roomID];
  
    if(!data.ques) return io.to(id).emit("failed", { msg: "Fill question" });
    if(data.options.filter(d => d.text == '').length) return io.to(id).emit("failed", { msg: "Fill all options" });
  
    room.question = {
        ...data,
        options: data.options.map(option => {return {...option, count: 0}}),
        totalVotes: 0
    }
  
    console.log('NEW QUESTION CREATED : ', room.question);
    sendUpdateToAll(room, 'newQuestion', room.question, id, io);
}