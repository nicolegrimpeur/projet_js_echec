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

    // affiche lors du clic sur une case les cases possibles et les pions qui peuvent être pris
    affiche(x_pos, y_pos) {

    }

    // déplace le pion et vérifie si un pion est mangé
    deplacement(x_clic, y_clic, x_pos, y_pos) {

    }

    // mat
    isMat() {

    }

    // roi en echec
    isEchec() {

    }
}