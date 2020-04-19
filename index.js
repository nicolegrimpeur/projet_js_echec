const port = 8100;

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

// const moduleTest = require('./server_modules/module');
// const Test = require('./server_modules/Class');
const Joueur = require('./server_modules/Joueur');
const Echec = require('./server_modules/Echec');

let nbJoueur = 0, joueur1, joueur2, game, playersIn = 0;

app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/lobby.html');
});

app.get('/lobby.html', (req, res, next) => {
    let pseudo = req.param("pseudo");
    let couleur = req.param("couleur");

    if (pseudo != null) { // création des joueurs
        if (joueur1 == null) {
            if (req.param("couleur") == "noirs") {
                joueur1 = new Joueur(pseudo, "noirs");
            } else joueur1 = new Joueur(pseudo, "blancs");
        } else if (joueur1.couleur == 0) {
            joueur2 = new Joueur(pseudo, "noirs");
        } else joueur2 = new Joueur(pseudo, "blancs");
    }

    console.log(pseudo + " " + couleur + " " + nbJoueur);
    if (joueur1 != null) console.log(joueur1.pseudo + " " + joueur1.couleur + " " + nbJoueur)
    if (joueur2 != null) console.log(joueur2.pseudo + " " + joueur2.couleur + " " + nbJoueur)

    res.sendFile( __dirname  + '/assets/views/lobby.html');
});

app.get('/plateau.html', (req, res, next) => {
    // moduleTest.b();
    // let test = new Test();
    // test.testHello();

    let pseudo = req.param("pseudo");
    let couleur = req.param("couleur");

    if (pseudo != null) { // création des joueurs
        if (joueur1 == null) {
            if (req.param("couleur") == "noirs") {
                joueur1 = new Joueur(pseudo, "noirs");
            } else joueur1 = new Joueur(pseudo, "blancs");
        } else if (joueur1.couleur == 0) {
            joueur2 = new Joueur(pseudo, "noirs");
        } else joueur2 = new Joueur(pseudo, "blancs");
    }

    console.log(pseudo + " " + couleur + " " + nbJoueur);
    if (joueur1 != null) console.log(joueur1.pseudo + " " + joueur1.couleur + " " + nbJoueur)
    if (joueur2 != null) console.log(joueur2.pseudo + " " + joueur2.couleur + " " + nbJoueur)
    res.sendFile(__dirname + '/assets/views/plateau.html');
});

io.sockets.on('connection', (socket) => {
    // io.emit('Hello', 'Un nouveau joueur est connecté !'); // permet d'envoyer le message à toutes les connections
    console.log('user connected');
    nbJoueur++;
    socket.emit('Hello', 'Bonjour nouveau joueur'); // envoi le message à la connection active

    socket.on('couleur?', (pseudo) => {
        socket.emit('couleur', (joueur1.pseudo == pseudo) ? joueur1.couleur : joueur2.couleur);
    });
    
    // les joueurs sont-ils enregistrés ?

    socket.on('2Players?', () => {
        if (joueur1 != null && joueur2 != null) playersIn = 1;
        console.log(playersIn);
        if (playersIn) {
            // socket.emit('2Players', playersIn);
            console.log(joueur1.pseudo + " " + joueur2.pseudo);
            if (game == null) game = new Echec(joueur1, joueur2) // si la partie n'est pas créée on démarre
        
            //console.log(game.getCurrentPlayer());
            game.getCurrentPlayer() == 0 ? turn = 0 : turn = 1;
            io.emit('plateau', game, turn)
        }
    });

    socket.on('plateau?', (pseudo) => {
        
    });

    /* if (playersIn) {
        socket.on('ready?', (pseudo) => {
            (joueur1.pseudo == pseudo) ? joueur1.isReady = 1 : joueur2.isReady = 1;
        });
        if (joueur1.isReady == 1 && joueur2.isReady == 1) {
            game = new Echec(joueur1, joueur2); // si les 2 joueurs sont prêts on démarre
            io.emit('plateau', game);
        }
        
    } */

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