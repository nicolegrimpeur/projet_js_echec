// objet contenant le cavalier
class Cavalier extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Cavalier");
        this.init();
    }


    init() {
        // position du cavalier
        this.capacite_de_deplacement.push([[+2, -1]], [[+2, +1]], [[+1, +2]], [[+1, -2]], [[-2, -1]], [[-2, +1]], [[-1, +2]], [[-1, -2]]);
    }
}