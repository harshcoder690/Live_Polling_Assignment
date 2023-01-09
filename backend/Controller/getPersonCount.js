const rooms = require('../rooms');
const sendUpdateToAll = require('../Utility/sendUpdateToAll');

module.exports = function getPersonCount({roomID}, id, io) {
    if(!roomID || !rooms[roomID]) return io.to(id).emit("failed", { msg: "Invalid action" });
    const room = rooms[roomID];
  
    sendUpdateToAll(room, 'personUpdated', room.students.length, id, io);
}
  