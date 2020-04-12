import("./Echec.js");

Number.prototype.between = function(lower, upper) {
    return lower <= this && this <= upper;
};

(function() {
    let game = new Echec();
    console.log(game.grid);
    // console.log(game.deplacement(3, 3, 3,1)); // avance pion noir de 2 case
    // // console.log(game.deplacement(3, 4, 3,3)); // avance pion noir d'une case
    // console.log(game.deplacement(6, 4, 2,0)); // avance fou noir en diagonale
    // console.log(game.deplacement(3, 4, 3,6)); // avance pion blanc de 2 cases
    // console.log(game.deplacement(4, 4, 4,6)); // avance pion blanc de 2 cases
    // console.log(game.deplacement(3, 3, 4,4)); // pion blanc mange pion noir
    // console.log(game.deplacement(3, 7, 6,4)); // fou noir mange reine blanche
    // console.log(game.pions_manges);
    let view = new EchecView(game, "echec1");
})();

