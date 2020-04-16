class Tour extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Tour");
        this.init();
    }

    init() {
        this.capacite_de_deplacement.push([-7, 0], [-6, 0], [-5, 0], [-4, 0], [-3, 0], [-2, 0], [-1, 0],
            [+1, 0], [+2, 0], [+3, 0], [+4, 0], [+5, 0], [+6, 0], [+7, 0],
            [0, +7], [0, +6], [0, +5], [0, +4], [0, +3], [0, +2], [0, +1],
            [0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]);
    }
}