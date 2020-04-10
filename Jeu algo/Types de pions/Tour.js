// objet contenant la tour
class Tour extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Tour");
        this.init();
    }

    init() {
        // la tour peut se déplacer en hauteur et en largeur
        this.capacite_de_deplacement.push([[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]],
            [[+1, 0], [+2, 0], [+3, 0], [+4, 0], [+5, 0], [+6, 0], [+7, 0]],
            [[0, +1], [0, +2], [0, +3], [0, +4], [0, +5], [0, +6], [0, +7]],
            [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]]);
    }
}