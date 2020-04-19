// parent de tous les pions
class Pions {
    constructor(couleur, x, y, type) {
        this.color = couleur;  // 0 blanc, 1 noir
        this.x = x; // position x du pion
        this.y = y; // position y du pion
        this.type = type; // type du pion
        this.capacite_de_deplacement = []; // liste des positions où peut se déplacer le pion autour de lu imême
    }

    get_pion_type() {
        return this.type;
    }
}
module.exports = Pions;