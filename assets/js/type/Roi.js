// objet contenant le roi
const Pions = require('../Pions');

class Roi extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Roi");
        this.init();
    }


    init() {
        // le roi peut se déplacer d'une case dans toutes les directions autour de lui
        for (let i = -1; i <= 1; ++i) {
            for (let j = -1; j <= 1; ++j) {
                if (!(i == 0 && j == 0)) {
                    this.capacite_de_deplacement.push([[i, j]]);
                }
            }
        }
    }
}
module.exports = Roi;