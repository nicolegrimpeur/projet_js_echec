class Pion extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Pion");
        this.init();
    }


    init() {
        if (this.color == 1) {
            this.capacite_de_deplacement.push([0, 1]);
        }
        else {
            this.capacite_de_deplacement.push([0, -1]);
        }
    }
}