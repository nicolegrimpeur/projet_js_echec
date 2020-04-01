class Roi extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Cavalier");
        this.init();
    }


    init() {
        for (let i = -1; i <= 1; ++i) {
            for (let j = -1; j <= 1; ++j) {
                if (!(i == 0 && j == 0)) {
                    this.capacite_de_deplacement.push([i, j]);
                }
            }
        }
    }
}