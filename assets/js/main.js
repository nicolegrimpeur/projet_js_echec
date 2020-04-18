import("./Echec.js");

// permet de vérifier si un nombre est compris entre deux valeurs
Number.prototype.between = function(lower, upper) {
    return lower <= this && this <= upper;
};

(function() {
    let game = new Echec();
    let view = new EchecView(game, "Plateau de jeu");
})();

