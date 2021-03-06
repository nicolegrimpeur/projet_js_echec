// objet contenant la dame
class Dame extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Dame");
        this.init();
    }


    init() {
        this.capacite_de_deplacement.push([[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]],
            [[+1, 0], [+2, 0], [+3, 0], [+4, 0], [+5, 0], [+6, 0], [+7, 0]],
            [[0, +1], [0, +2], [0, +3], [0, +4], [0, +5], [0, +6], [0, +7]],
            [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]],
            [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]],
            [[+1, +1], [+2, +2], [+3, +3], [+4, +4], [+5, +5], [+6, +6], [+7, +7]],
            [[-1, +1], [-2, +2], [-3, +3], [-4, +4], [-5, +5], [-6, +6], [-7, +7]],
            [[+1, -1], [+2, -2], [+3, -3], [+4, -4], [+5, -5], [+6, -6], [+7, -7]]);
    }
}