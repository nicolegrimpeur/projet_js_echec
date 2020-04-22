const port = 26000;
const bodyParser=require("body-parser");

const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

const Joueur = require('./server_modules/Joueur');

let nbJoueur = 0, nbInGame = 0, joueur1, joueur2, clients = [], playersIn = 0, turn = 0, grid = 0, echec = false;

app.use(express.static(__dirname + '/assets/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/assets/views/acceuil.html');
});

app.post('/',(req,res,next)=>{
    console.log(req.body);
});

app.get('/lobby.html', (req, res, next) => {
    let psdo = req.param("pseudo"), colr = req.param("couleur");
    
    createPlayer(psdo, colr);

    res.sendFile( __dirname  + '/assets/views/lobby.html');
});

app.get('/plateau.html', (req, res, next) => {
    let psdo = req.param("pseudo"), colr = req.param("couleur");

    createPlayer(psdo, colr);

    res.sendFile(__dirname + '/assets/views/plateau.html');
});

io.sockets.on('connection', (socket) => {
    clients.push(socket);
    io.emit('Hello', 'Un nouveau joueur est connecté !'); // permet d'envoyer le message à toutes les connections

    nbJoueur++;

    socket.on('couleur?', (pseudo) => {
        socket.emit('couleur', (joueur1.pseudo == pseudo) ? joueur1.couleur : joueur2.couleur);
    });

    socket.on('ready?', () => {
        // les 2 joueurs sont-ils enregistrés ?
        nbInGame++;
        if (playersIn && nbInGame >= 2) {
            console.log(joueur1.pseudo + " contre " + joueur2.pseudo);
            io.emit('init', joueur1, joueur2)
        }
    });
    
    socket.on('refresh', (couleur) => {
        if (turn % 2 == couleur) {
            socket.emit('refresh', grid, turn, echec);
        }
    });
    
    socket.on('update', (newGrid, newTurn, newEchec) => {
        if (turn == 0 || newTurn > 0) {
            turn = newTurn;
            grid = newGrid;
            echec = newEchec;
        }
        io.emit('refresh', grid, turn, echec);

        console.log("turn " + turn);
    });

    socket.on('nouveau_client', (pseudo) => {
        console.log("new client", pseudo);
    });

    socket.on('message', (msg,pseudo) => {
        console.log("le message est:", msg,"le pseudo de la personne est:",pseudo);
        for (let i =0;i<clients.length;i++){
            console.log(clients[i].id);
        }
        for (let i =0;i<clients.length;i++){
            if(clients[i].id==socket.id) continue;
            clients[i].emit('push_message',msg,pseudo);
        }
    });

    socket.on('private message', (from, msg) => {
        console.log('Message de ', from, ' disant : ', msg);
    });

    socket.on('disconnect', (reason) => {
        console.log('user disconnected for', reason);
        let index=clients.indexOf(socket);
        if(index!==-1) clients.splice(index,1);

        nbJoueur--;
        if (!nbJoueur && playersIn) {
            joueur1 = null, joueur2 = null, playersIn = 0, nbInGame = 0, turn = 0, grid = 0, echec = false;
            console.log("server reseted !");
        }
    });
});

createPlayer = (psdo, colr) => {
    console.log(psdo + " " + colr + " " + nbJoueur);

    if(psdo !=null) {
        if (!playersIn) { // si les joueurs sont déjà enregistré (protection)
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
    }
    if (joueur1 != null && joueur2 != null) playersIn = 1;
}

server.listen(port);
console.log('Server instantiated');