const rooms = require('../rooms');
const sendUpdateToAll = require('../Utility/sendUpdateToAll');

module.exports = function joinRoom({roomID, name}, id, io) {
    if (!roomID || !rooms[roomID])
        return io.to(id).emit("failed", { msg: "No Room found" });
      if (rooms[roomID].students.find(student => student.socketID == id))
        return io.to(id).emit("failed", { msg: "Already joined" });
      if (rooms[roomID].teacher.socketID == id)
        return io.to(id).emit("failed", { msg: "Invalid request" });
    
    const room = rooms[roomID];
    name = name || `Player-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  
    room.students.push({
      name,
      socketID: id
    });
  
    console.log("Room Joined : ", room);
    io.to(id).emit("roomJoined", { playerName: name, roomID: room.roomID});
    sendUpdateToAll(room, 'personUpdated', room.students.length, id, io);
}