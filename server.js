const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: '*',
      }
    
});

let rooms = []
let levelRange = 2

io.on("connection", (socket) => {
  console.log(`User ${socket}`);
  socket.on('findGame',(user)=>{
    let{username,level,questions} = user
    socket.level = level
    socket.username = username
    socket.questions = questions
    // let room = rooms.find(r=> r.users.length == 1 && r.users.some(user=>user.level - levelRange <=  userLevel || user.level + levelRange >=  userLevel))
    let room = rooms.find(r=> r.users.length == 1 && room.users[0].username != socket.username)
    if(room == null){
      console.log(room);
      rooms.push({roomId:uuid.v4(),users:[socket]})
      socket.emit('waitForPlayer')
    } else{
      room.users[0].join(room.roomId)
      socket.join(room.roomId)
      room.users[0].emit('startMatch',{username:socket.username,level:socket.level,roomId:room.roomId,questions:socket.questions})
      socket.emit('startMatch',{username:room.users[0].username,level:room.users[0].level,roomId:room.roomId,questions:socket.questions})
      let roomIndex = rooms.findIndex(r=>r.roomId == rooms.roomId)
      rooms.splice(roomIndex,1)
      */,{questions,room.roomId}*/
    }})
  socket.on("answer",(data)=>{
    let {correctAnswers,roomID} = data
    socket.broadcast.to(roomID).emit('userAnswered',{correctAnswers})
    console.log(correctAnswers,roomID);
  })
  
});

io.on("disconnect", (socket) => {
    console.log(`User ${socket} disconnected`);
    socket.emit("fromServer", "disco");
  });

io.on("msg" , ((data) =>{
    print(data)
    io.emit("fromServer", "Hello");
}))


httpServer.listen(process.env.PORT ||port);
