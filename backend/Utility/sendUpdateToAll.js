module.exports = function sendUpdateToAll(room, event, data, id, io) {
    room.students.forEach(student => { io.to(student.socketID).emit(event, data) });
    io.to(room.teacher.socketID).emit(event, data);
}