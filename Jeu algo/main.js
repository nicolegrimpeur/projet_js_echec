import("./Echec.js");

Number.prototype.between = function(lower, upper) {
    return lower <= this && this <= upper;
};

(function() {
    let game = new Echec();
    console.log(game.grid);
    console.log(game.deplacement(3, 3, 3,1));
    console.log(game.deplacement(3, 4, 3,3));
    console.log(game.deplacement(6, 4, 2,0));
    console.log(game.deplacement(3, 4, 3,6));
    console.log(game.deplacement(4, 4, 4,6));
    console.log(game.deplacement(3, 7, 6,4));
    console.log(game.pions_manges);
    let view = new EchecView(game, "echec1");

})();

