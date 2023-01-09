const rooms = require('../rooms');
const sendUpdateToAll = require('../Utility/sendUpdateToAll');

module.exports = function getCurrQuestion({roomID}, id , io) {
    if(!roomID || !rooms[roomID]) return io.to(id).emit("failed", { msg: "Invalid action" });
    io.to(id).emit('questionUpdated', {...rooms[roomID].question});
}