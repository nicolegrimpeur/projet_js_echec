class Pions {
    constructor(couleur, x, y, type) {
        this.color = couleur;  // 0 blanc, 1 noir
        this.x = x;
        this.y = y;
        this.type = type;
        this.capacite_de_deplacement = [];
    }

    get_pion_type() {
        return this.type;
    }
}