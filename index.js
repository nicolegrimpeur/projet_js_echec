const port = 8100;

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

const Joueur = require('./server_modules/Joueur');

let nbJoueur = 0, nbInGame = 0, joueur1, joueur2, playersIn = 0, turn = 0, grid = 0;

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    console.log("sleeping");
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/acceuil.html');
});

app.get('/lobby.html', (req, res, next) => {
    let psdo = req.param("pseudo");
    let colr = req.param("couleur");
    //console.log(psdo + " " + colr + " " + nbJoueur);

    if (psdo != null && !playersIn) { // si les joueurs sont déjà enregistré (protection)
        if (joueur1 == null) { // création des joueurs
            if (colr == "noirs" || colr == 1) {
                joueur1 = new Joueur(psdo, "noirs");
            } else joueur1 = new Joueur(psdo, "blancs");
        } else if (psdo != joueur1.pseudo) {
            if (joueur1.couleur == 0) joueur2 = new Joueur(psdo, "noirs");
            else joueur2 = new Joueur(psdo, "blancs");
        }
    } else {
        console.log(joueur1.pseudo + " " + joueur1.couleur + " " + nbJoueur)
        console.log(joueur2.pseudo + " " + joueur2.couleur + " " + nbJoueur)
    }
    
    if (joueur1 != null && joueur2 != null) playersIn = 1;
    //console.log(playersIn);

    res.sendFile( __dirname  + '/assets/views/lobby.html');
});

app.get('/plateau.html', (req, res, next) => {
    let psdo = req.param("pseudo");
    let colr = req.param("couleur");
    //console.log(psdo + " " + colr + " " + nbJoueur);

    if (psdo != null && !playersIn) { // si les joueurs sont déjà enregistré (protection)
        if (joueur1 == null) { // création des joueurs
            if (colr == "noirs" || colr == 1) {
                joueur1 = new Joueur(psdo, "noirs");
            } else joueur1 = new Joueur(psdo, "blancs");
        } else if (psdo != joueur1.pseudo) {
            if (joueur1.couleur == 0) joueur2 = new Joueur(psdo, "noirs");
            else joueur2 = new Joueur(psdo, "blancs");
        }
    } else {
        console.log(joueur1.pseudo + " " + joueur1.couleur + " " + nbJoueur)
        console.log(joueur2.pseudo + " " + joueur2.couleur + " " + nbJoueur)
    }

    if (joueur1 != null && joueur2 != null) playersIn = 1;
    //console.log(playersIn);

    res.sendFile(__dirname + '/assets/views/plateau.html');
});

io.sockets.on('connection', (socket) => {
    io.emit('Hello', 'Un nouveau joueur est connecté !'); // permet d'envoyer le message à toutes les connections
    console.log('user connected');
    nbJoueur++;

    socket.on('couleur?', (pseudo) => {
        socket.emit('couleur', (joueur1.pseudo == pseudo) ? joueur1.couleur : joueur2.couleur);
    });

    socket.on('ready?', () => {
        // les 2 joueurs sont-ils enregistrés ?
        nbInGame++;
        if (playersIn && nbInGame >= 2) {
            console.log(joueur1.pseudo + " contre " + joueur2.pseudo);
            io.emit('init', turn, joueur1, joueur2)
        }
    });
    
    socket.on('refresh', (couleur) => {
        if (turn % 2 == couleur) {
            socket.emit('refresh', grid, turn);
        }
    });
    
    socket.on('update', (newGrid, newTurn) => {
        turn = newTurn;
        grid = newGrid;
        io.emit('refresh', grid, turn);

        console.log("turn " + turn);
        //console.log("C'est au tour de " + (turn % 2 == joueur1.couleur) ? joueur1.pseudo : joueur2.pseudo);
    });

    socket.on('private message', (from, msg) => {
        console.log('Message de ', from, ' disant : ', msg);
    });

    socket.on('disconnect', () => {
        io.emit('Hello', 'Un joueur a quitté la partie');
        console.log('user disconnected');
        nbJoueur--;
        if (!nbJoueur) {
            joueur1 = null, joueur2 = null, playersIn = 0, nbInGame = 0, turn = 0, grid = 0;
            console.log("server reseted !");
        }
    });
});

server.listen(port);
console.log('Server instantiated');