import  express  from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http"
import { Socket } from "dgram";
import { connect } from "./mongoose.js";
import { chatModel } from "./chatSchema.js";
import { timeStamp } from "console";



const app = express();
// 1. cretae server using http

const server = http.createServer(app);

// 2. creating socket server
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:["GET","POST"]
    }
});

// 3. Use soket events .

io.on('connection', (socket) =>{
    console.log("connection is establish");
    socket.on("join",(data)=>{
        socket.userName = data;

        chatModel.find().sort({timestamp:1}).limit(50)
        .then(messages=>{
            socket.emit("load_message", messages)
        }).catch(err=>{
            console.log(err)
        })
    })

   
    socket.on('new-message', (message)=>{
        let userMessage = {
            userName : socket.userName,
            message : message
        }

        const newChat = new chatModel({
            username:socket.userName,
            message:message,
            timestamp:new Date()
        })
        newChat.save();
        socket.broadcast.emit('broadcast_message', userMessage);
    })
    socket.on("disconnect",() =>{
        console.log("connection is disconnected");
    })
})


server.listen(3000,() =>{
    console.log("App is listining on 3000")
    connect();
})

















































































































































//  2. create socket io server

// const io = new Server(server, {
//     cors:{
//         origin:'*',
//         methods:["GET", "POST"]
//     }
// });

// //  3. Use soket event 

// io.on('connection', (Socket) =>{
//     console.log('Connection is established');
//     Socket.on("join", (data) =>{
//         Socket.username = data;

//         chatModel.find().sort({timestamp:1}).limit(30).then(message =>{
//             Socket.emit('load_message', message);
//         }).catch(err => {
//             console.log(err);
//         })
//     })
    
//     Socket.on('new_message', (message) =>{
//         // broadcast this message to al the client
//         let usermessage = {
//             username :Socket.username,
//             message:message
//         }

//         const newChat = new chatModel({
//             username:Socket.username,
//             message:message,
//             timestamp:new Date()
//         });
//         newChat.save();
//         Socket.broadcast.emit('broadcast_message', usermessage);
//     })
//     Socket.on('disconnect' , () =>{
//         console.log("Connection is disconnected");
//     });
// });

// server.listen(3000, () =>{
//     console.log("server is listning on port no 3000");
//     // connect();
// })