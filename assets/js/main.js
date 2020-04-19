import("./EchecView.js");
import("./getParam.js");

// permet de vérifier si un nombre est compris entre deux valeurs
Number.prototype.between = function(lower, upper) {
    return lower <= this && this <= upper;
};

(function() {
    let pseudo = $_GET('pseudo'), couleur = $_GET('couleur'); // récupère le pseudo et la couleur du joueur
    console.log(pseudo + " " + couleur);

    const socket = io.connect('http://localhost:8100');

    socket.emit('couleur?' , pseudo);
    socket.on('couleur' , (couleur) => {
        document.getElementById("couleur").textContent = "Tu joues les " + ((couleur == 0) ? "blancs" : "noirs");
        console.log(couleur);
    });

    socket.emit('plateau?');
    socket.on('plateau' , (game) => {
        let view = new EchecView(game, "Plateau de jeu");
    });

    socket.emit('ready?');
    socket.on('ready' , (pseudo) => {
        let view = new EchecView(game, "Plateau de jeu");
    });

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