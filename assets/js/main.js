import("./EchecView.js");
import("../../server_modules/Echec");
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
    
    let playersIn = new Boolean(0);

    const socket = io.connect('http://localhost:8100');

    socket.emit('couleur?', pseudo);
    socket.on('couleur', (couleurBin) => {
        document.getElementById("couleur").textContent = "Tu joues les " + ((couleurBin == 0) ? "blancs" : "noirs");
        couleur = couleurBin;
        //console.log(couleur);
    });

    socket.emit('2Players?');
    // socket.on('2Players?', (playersIn) => {
    //     if (playersIn) {
    //         socket.emit('plateau?');
    //     }
    // });

    socket.on('plateau', (game, turn) => {
        console.log(turn);
        let view = new EchecView(game, "Plateau de jeu", couleur);
    });

    /*while (playersIn != 1) {
        console.log("waiting");
        sleep(2000);
    }*/

    // socket.emit('ready?');
    // socket.on('ready' , (pseudo) => {
    //     let view = new EchecView(game, "Plateau de jeu");
    // });
    
    // MISE EN PLACE DU BOUTON PRÊT !!!




    // socket.on('update', (board) => {
    //     while (scene.meshes.length > 17) scene.meshes.pop();
    //     //scene.meshes.length = 17;
    //     for (let i = 0; i < board.length; i++) {
    //         let piece;
    //         if (board[i].id == 'pawn') piece = scene.meshes[board[i].white ? 3 : 9].clone('Pawn');
    //         else if (board[i].id == 'knight') piece = scene.meshes[board[i].white ? 6 : 12].clone('Knight');
    //         else if (board[i].id == 'bishop') piece = scene.meshes[board[i].white ? 2 : 8].clone('Bishop');
    //         else if (board[i].id == 'queen') piece = scene.meshes[board[i].white ? 4 : 10].clone('Queen');
    //         else if (board[i].id == 'rock') piece = scene.meshes[board[i].white ? 5 : 11].clone('Rock');
    //         else if (board[i].id == 'king') piece = scene.meshes[board[i].white ? 7 : 13].clone('King');
    //         piece.position = new BABYLON.Vector3(62 - board[i].x * 18, 8, 62 - board[i].y * 18);
    //         piece.white = board[i].white;
    //         piece.pick = 1;
    //     }
    // });
    
    // function sendMove(cx, cy, nx, ny) {
    //     socket.emit('move', cx, cy, nx, ny);
    // }
})();