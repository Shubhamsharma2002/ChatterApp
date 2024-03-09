import  express  from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http"

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

    Socket.on('disconnect' , () =>{
        console.log("Connection is disconnected");
    });
});

server.listen(3000, () =>{
    console.log("server is listning on port no 3000");
})