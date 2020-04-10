// objet contenant le pion
class Pion extends Pions {
    constructor(couleur, x, y) {
        super(couleur, x, y, "Pion");
        this.init();
    }


    init() {
        // le pion peut se déplacer en hauteur d'une case, et de 2 s'il n'a encore jamais bougé
        // et en diagonale d'une case si un pion ennemi est positionné dessus
        if (this.color == 1) {
            this.capacite_de_deplacement.push([[0, 1], [1, 1], [-1, 1], [0, 2]]);
        }
        else {
            this.capacite_de_deplacement.push([[0, -1], [1, -1], [-1, -1], [0, -2]]);
        }
    }
}