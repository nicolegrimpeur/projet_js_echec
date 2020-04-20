const port = 8100;
const bodyParser=require("body-parser");

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const socket = require('socket.io');
const io=socket(server,{
    serverClient: false,
    pingInterval: 10000,
    pingTimeout:5000,
    cookie: false
});

app.use(express.static(__dirname + '/assets/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/acceuil.html');
});

app.post('/',(req,res,next)=>{
    console.log(req.body);
});

var clients=[];

io.on("connection", socket =>{
    console.log(socket.id);
    clients.push(socket);
    socket.on('disconnect',function(reason){
        console.log("disconnected",reason)
        let index=clients.indexOf(socket)
        if(index!==-1) clients.splice(index,1)
    });
    socket.on('error',function(error){
        console.log("error",error)
    });
    socket.on('disconnecting',function(reason){
        console.log("disconnecting",reason)
    });
    socket.on('nouveau_client',function(pseudo) {
        console.log("new client", pseudo)
    });
    socket.on('message',function(msg,pseudo) {
        console.log("le message est:", msg,"le pseudo de la personne est:",pseudo)
        for (let i =0;i<clients.length;i++){
            console.log(clients[i].id)
        }
        for (let i =0;i<clients.length;i++){
            if(clients[i].id==socket.id) continue
            clients[i].emit('push_message',msg,pseudo)
        }
    });
});

server.listen(port);
console.log('Server instantiated');