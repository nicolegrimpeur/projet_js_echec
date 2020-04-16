const port = 8100;

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

const moduleTest = require('./server_modules/module');
const Test = require('./server_modules/Class');
const Joueur = require('./assets/js/Joueur');

let nbJoueur = 0, joueur1, joueur2;

app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/lobby.html');
});

app.get('/lobby.html', (req, res, next) => {
    var pseudo = req.param("pseudo");
    var couleur = req.param("couleur");
    // if (pseudo != null) {
    //     if (nbJoueur == 1) {
    //         if (req.param("couleur") == "lambda" || req.param("couleur") == "white") {
    //             joueur1 = new Joueur(pseudo, "white");
    //         } else joueur1 = new Joueur(pseudo, "black");
        
    //     } else if (req.param("couleur") == "white" && joueur1.couleur != 0) {
    //         joueur2 = new Joueur(pseudo, "white");
    //     } else joueur2 = new Joueur(pseudo, "black");
    // }
    console.log(pseudo + " " + couleur + " " + nbJoueur);
    res.sendFile( __dirname  + '/assets/views/lobby.html');
});

app.get('/plateau.html', (req, res, next) => {
    // moduleTest.b();
    // let test = new Test();
    // test.testHello();
    res.sendFile(__dirname + '/assets/views/plateau.html');
});

io.sockets.on('connection', function (socket) {
    // io.emit('Hello', 'Un nouveau joueur est connecté !'); // permet d'envoyer le message à toutes les connections
    console.log('user disconnected');
    nbJoueur++;
    socket.emit('Hello', 'Bonjour nouveau joueur'); // envoi le message à la connection active


    socket.on('private message', (from, msg) => {
        console.log('Message de ', from, ' disant : ', msg);
    });

    socket.on('disconnect', () => {
        io.emit('Hello', 'Un joueur a quitté la partie');
        console.log('user disconnected');
        nbJoueur--;
        // for(var props in Joueur){
        //     Joueur.prop = undefined;
        // }
    });
});

server.listen(port);
console.log('Server instantiated');