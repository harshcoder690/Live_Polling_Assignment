const rooms = require('../rooms');
const sendUpdateToAll = require('../Utility/sendUpdateToAll');

module.exports = function disconnect(data, id, io) {
    console.log(`User ${id} disconnected`);
  
    Object.values(rooms).forEach((room) => {
      if(room.teacher.socketID == id) {
        // Teacher left
        console.log('TEACHER LEFT, REMOVING ROOM ID : ', room.roomID);
        delete rooms[room.roomID];
        
        sendUpdateToAll(room, 'teacherLeft', null, id, io);
        // this.io.emit('teacherLeft');
      }
      else {
        // Student left
        console.log('STUDENT LEFT, REMOVING STUDENT : ', id);
        room.students = room.students.filter(st => st.socketID != id);
  
        sendUpdateToAll(room, 'personUpdated', room.students.length, id, io);
        // this.io.emit('personUpdated', room.students.length);
      }
    });
}