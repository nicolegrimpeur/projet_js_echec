class Cavalier extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Cavalier");
        this.init();
    }


    init() {
        this.capacite_de_deplacement.push([[+2, -1]], [[+2, +1]], [[+1, +2]], [[+1, -2]], [[-2, -1]], [[-2, +1]], [[-1, +2]], [[-1, -2]]);
    }
}