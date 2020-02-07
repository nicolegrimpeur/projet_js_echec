const port = 8100;

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

const moduleTest = require('./server_modules/module');
const Test = require('./server_modules/Class');

app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/index.html');
});

app.get('/view2', (req, res, next) => {
    moduleTest.b();
    let test = new Test();
    test.testHello();
    res.sendFile(__dirname + '/assets/views/view2.html');
});

io.sockets.on('connection', function (socket) {
    io.emit('Hello', 'A new connection on our website !'); // permet d'envoyer le message à toutes les connections

    socket.emit('Hello', 'Hello to you!'); // envoi le message à la connection active

    socket.on('private message', (from, msg) => {
        console.log('I received a private message by ', from, ' saying ', msg);
    });

    socket.on('disconnect', () => {
        io.emit('user disconnected');
    });
});

server.listen(port);
console.log('Server instantiated');