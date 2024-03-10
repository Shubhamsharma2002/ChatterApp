import  express  from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http"
import { connect}  from "./mongoose.js";
import { chatModel } from "./chatSchema.js";

const app = express();
// 1. cretae server using http

const server = http.createServer(app);

//  2. create socket io server

const io = new Server(server, {
    cors:{
        origin:'*',
        methods:["GET", "POST"]
    }
});

//  3. Use soket event 

io.on('connection', (Socket) =>{
    console.log('Connection is established');
    Socket.on("join", (data) =>{
        Socket.username = data;

        chatModel.find().sort({timestamp:1}).limit(30).then(message =>{
            Socket.emit('load_message', message);
        }).catch(err => {
            console.log(err);
        })
    })
    
    Socket.on('new_message', (message) =>{
        // broadcast this message to al the client
        let usermessage = {
            username :Socket.username,
            message:message
        }

        const newChat = new chatModel({
            username:Socket.username,
            message:message,
            timestamp:new Date()
        });
        newChat.save();
        Socket.broadcast.emit('broadcast_message', usermessage);
    })
    Socket.on('disconnect' , () =>{
        console.log("Connection is disconnected");
    });
});

server.listen(3000, () =>{
    console.log("server is listning on port no 3000");
    connect();
})