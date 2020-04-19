import("./EchecView.js");
//import("./Echec.js");
import("./getParam.js");

// permet de vérifier si un nombre est compris entre deux valeurs
Number.prototype.between = function(lower, upper) {
    return lower <= this && this <= upper;
};

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

(function() {
    let pseudo = $_GET('pseudo'), couleur = $_GET('couleur'); // récupère le pseudo et la couleur du joueur
    console.log(pseudo + " " + couleur);
    
    let view = 0, game, gridTmp, turnTmp, newTurn;

    const socket = io.connect('http://localhost:8100');

    socket.emit('couleur?', pseudo);

    socket.on('couleur', (couleurBin) => {
        document.getElementById("couleur").textContent = "Tu joues les " + ((couleurBin == 0) ? "blancs" : "noirs");
        couleur = couleurBin;
        //console.log(couleur);
    });

    socket.emit('2Players?');

    socket.on('init', (grid, turn, joueur1, joueur2) => {
        console.log(turn);
        turnTmp = turn;
        gridTmp = grid;
        if (game == null) {
            game = new Echec(grid, joueur1, joueur2);
            view = new EchecView(game, "Plateau de jeu", couleur, joueur1, joueur2);
        }
    });

    socket.emit('refresh', couleur);
        
    socket.on('refresh', (grid, turn) => {
        turnTmp = turn; //tour du serveur
        gridTmp = grid; //grille du serveur

        console.log(turnTmp);
        console.log(gridTmp);

        game.tour = turnTmp;
        game.grid = griTmp;

        view = new EchecView(game, "Plateau de jeu", couleur, joueur1, joueur2);

        if (turnTmp %2 == couleur) { //tant que c'est mon tour
            while (gridTmp == game.grid) { //tant que je n'ai pas joué
                sleep(5000);
            }
            socket.emit('update', game.grid); //envoie de la nouvelle grille
            console.log(game.grid)
        }
    });
})();