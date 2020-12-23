const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);//creating a server using http // we need some special features and therefore we created server this way
const io = socketio(server);


//set static folder // static folders are those which are served to all the users from the server 
app.use(express.static(path.join(__dirname,'public')));

const botName = 'Chatcord bot';

//run when client connects
io.on('connection', socket=>{  //connection is event name
    
    //console.log('new web socket connection');
    socket.on('joinRoom',({username, room})=>{
        const user = userJoin(socket.id,username,room);
    

        socket.join(user.room);// joins to a particular room

    //welcome current user
    socket.emit('message',formatMessage(botName,'welcome to chatcord'));// sends only to the sender

    //broadcast when a user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));//sends to all clients except the sender
        //to(user.room).emit() emit msg to a particular room 
    
    //send users and room info 
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    });
    
    
    });

    //listen for chat messsage from client
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);
        
        //to(user.room) enables the msgs of two different rooms to not get mixed
        io.to(user.room).emit('message',formatMessage(user.username,msg));  //?  //sending it back to client 
    });

     //runs when client disconnects
     socket.on('disconnect',()=>{
         const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));//io.emit send to all clients including the sender
       

        //send users and room info 
        io.to(user.room).emit('roomUser',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
    };

    });

});

const PORT = 3000 || process.env.PORT; //if we have any environment virable name PORT then we can use it or else take PORT value as 3000

server.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
});
