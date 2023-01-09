const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require('cors');

// Controllers
const createRoom = require('./Controller/createRoom');
const joinRoom = require('./Controller/joinRoom');
const submit = require('./Controller/submit');
const getCurrQuestion = require('./Controller/getCurrQuestion');
const getPersonCount = require('./Controller/getPersonCount');
const questionReset = require('./Controller/questionReset');
const uploadQuestion = require('./Controller/uploadQuestion');
const disconnect = require('./Controller/disconnect');

const app = express();

// CREATION AND LISTENING OF SERVER
const PORT = process.env.PORT || 4000;
const server = http.Server(app);
server.listen(PORT, () => { console.log(`App listening on ${PORT}`) });
const io = socketIO(server, { cors: { origin: "*" } });;

// FOR STATIC FILES
app.use(express.static("./public"));

io.on("connection", (socket) => {
    // Create room
    socket.on("createRoom", (data) => createRoom(data, socket.id, io));

    // New Student joins the room
    socket.on("joinRoom", (data) => joinRoom(data, socket.id, io));

    // Teacher uploads a new question
    socket.on("uploadQuestion", (data) => uploadQuestion(data, socket.id, io));

    // Student submitted his vote
    socket.on('submit', (data) => submit(data, socket.id, io));

    // User (Student/Teacher) fetching question info
    socket.on('getCurrQuestion', (data) => getCurrQuestion(data, socket.id, io))

    // Teacher asking another question
    socket.on('questionReset', (data) => questionReset(data, socket.id, io))

    // Get no. of students currently present in room
    socket.on('getPersonCount', (data) => getPersonCount(data, socket.id, io))

    // If student or a teacher leaves the room
    socket.on("disconnect", (data) => disconnect(data, socket.id, io));
});