import("./EchecView.js");
import("./Echec.js");
import("./getParam.js");

(function() {
    var pseudo = $_GET('pseudo'), couleur = $_GET('couleur') // récupère le pseudo et la couleur du joueur
    
    var view = 0, game, tab;

    const socket = io.connect('http://localhost:8100');

    socket.emit('nouveau_client', pseudo);
    document.title = pseudo + ' - ' + document.title;

    // insertion dans la page de jeu
    socket.on('push_message',function(msg,pseudo) {
        insereMessage(pseudo+":", msg);
    })
    // Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
    $('#formulaire_chat').submit(function () {
        var message = $('#message').val();
        socket.emit('message', message,pseudo); // visible pour tous
        insereMessage(pseudo+":", message); // Affiche le message aussi sur notre page
        $('#message').val('').focus(); // Vide l'espace d'écriture
        return false; // pour bloquer une nouvelle demande du pseudo
    });

    // l'ajout d'un message
    function insereMessage(pseudo, message) {
        $('#zone_chat').prepend('<p><strong>' + pseudo + '</strong> ' + message + '</p>');
    }




    socket.emit('couleur?', pseudo);

    socket.on('couleur', (couleurBin) => {
        //document.getElementById("couleur").textContent = "Tu joues les " + ((couleurBin == 0) ? "blancs" : "noirs");
        console.log(pseudo + " " + ((couleurBin == 0) ? "blancs" : "noirs"));
        couleur = couleurBin;
    });

    // client prêt à lancer la partie
    socket.emit('ready?');

    // initialisation du plateau
    socket.on('init', (turn, joueur1, joueur2) => {
        console.log(joueur1.pseudo + " contre " + joueur2.pseudo);

        tab = document.getElementById("tab");
        while (tab.firstChild) {
            tab.removeChild(tab.lastChild);
        }

        game = new Echec(joueur1, joueur2);
        view = new EchecView(game, "Plateau de jeu", couleur);

        if (turn % 2 == couleur) socket.emit('update', game.grid, game.tour);
    });        
        
    socket.on('refresh', (grid, turn) => {
        if (turn > game.tour) { // mise à jour du plateau
            game.tour = turn;
            game.grid = grid;

            view.modif_grid(["refresh"]);

            socket.emit('refresh', couleur);
        } else if (turn == game.tour) { // tant que je n'ai pas joué
            socket.emit('refresh', couleur);
        } else {
            socket.emit('update', game.grid, game.tour); //envoie de la nouvelle grille
        }
    });
})();

// permet de vérifier si un nombre est compris entre deux valeurs
Number.prototype.between = function(lower, upper) {
    return lower <= this && this <= upper;
};