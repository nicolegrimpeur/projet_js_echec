class Joueur {
    constructor(pseudo, couleur) {
        this.pseudo = pseudo
        this.couleur = (couleur == "blancs") ? 0 : 1;
        this.points = 0;
    }

    ajout_points(type) {
        if (type == "Dame") {
            this.points += 9;
        }
        else if (type == "Tour") {
            this.points += 5;
        }
        else if (type == "Cavalier") {
            this.points += 3;
        }
        else if (type == "Fou") {
            this.points += 3;
        }
        else if (type == "Pion") {
            this.points += 1;
        }
    }
}