// objet contenant le fou
const Pions = require('../Pions');

class Fou extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Fou");
        this.init();
    }

    init() {
        // le fou peut se déplacer en diagonales
        this.capacite_de_deplacement.push([[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]],
            [[+1, +1], [+2, +2], [+3, +3], [+4, +4], [+5, +5], [+6, +6], [+7, +7]],
            [[-1, +1], [-2, +2], [-3, +3], [-4, +4], [-5, +5], [-6, +6], [-7, +7]],
            [[+1, -1], [+2, -2], [+3, -3], [+4, -4], [+5, -5], [+6, -6], [+7, -7]]);
    }
}
module.exports = Fou;