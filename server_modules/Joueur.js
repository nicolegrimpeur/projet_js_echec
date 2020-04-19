class Joueur {
    constructor(pseudo, couleur) {
        this.pseudo = pseudo;
        this.couleur = (couleur == "blancs") ? 0 : 1;
        this.points = 0;
        this.isReady = 0;
    }

    // ajoute les points au joueur en fonction du pion mangé
    ajout_points(type) {
        if (type == "Dame") {
            this.points += 8.8;
        }
        else if (type == "Tour") {
            this.points += 5.1;
        }
        else if (type == "Cavalier") {
            this.points += 3.2;
        }
        else if (type == "Fou") {
            this.points += 3.33;
        }
        else if (type == "Pion") {
            this.points += 1.0;
        }
    }
}

module.exports = Joueur;