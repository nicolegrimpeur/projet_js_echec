import("./Pions.js");

class Echec {
    constructor() {
        this.grid = new Array(8); // tableau de position en 8*8
        this.init_grid();
        this.reset();
        this.tour = 0; // nombre pair : joueur 0, nombre impair : joueur 1
        this.currentPlayer = 0;
        this.pions_manges = []; // stocke les pions qui ont été mangé
    }

    // initialise la taille de la liste grid
    init_grid() {
        for (let i = 0; i < 8; ++i) {
            this.grid[i] = Array(8);
        }
    }

    // remet à 0 le tableau grid et les variables utiles
    reset() {
        // positions des pions sur un jeu d'echec classique
        this.grid[0][0] = new Tour(1, 0, 0);
        this.grid[0][1] = new Cavalier(1, 1, 0);
        this.grid[0][2] = new Fou(1, 2, 0);
        this.grid[0][3] = new Dame(1, 3, 0);
        this.grid[0][4] = new Roi(1, 4, 0);
        this.grid[0][5] = new Fou(1, 5, 0);
        this.grid[0][6] = new Cavalier(1, 6, 0);
        this.grid[0][7] = new Tour(1, 7, 0);
        for (let i = 0; i <= 7; ++i) {
            this.grid[1][i] = new Pion(1, i, 1);
        }

        this.grid[7][0] = new Tour(0, 0, 7);
        this.grid[7][1] = new Cavalier(0, 1, 7);
        this.grid[7][2] = new Fou(0, 2, 7);
        this.grid[7][3] = new Dame(0, 3, 7);
        this.grid[7][4] = new Roi(0, 4, 7);
        this.grid[7][5] = new Fou(0, 5, 7);
        this.grid[7][6] = new Cavalier(0, 6, 7);
        this.grid[7][7] = new Tour(0, 7, 7);
        for (let i = 0; i <= 7; ++i) {
            this.grid[6][i] = new Pion(0, i, 6);
        }

        for (let i = 2; i <= 5; ++i) {
            for (let j = 0; j <= 7; ++j) {
                this.grid[i][j] = undefined;
            }
        }

        this.tour = 0;
        this.pions_manges = [];
    }

    // renvoi le joueur
    getCurrentPlayer() {
        return (this.tour % 2); // 0 blanc, 1 noir
    }

    // renvoi l'etat d'une case
    getCaseState(x, y) {
        // vérifie que les coordonnées sont dans la grille
        if (x.between(0, 7) && y.between(0, 7)) {
            return this.grid[y][x];
        }
        // sinon la case n'existe pas
        return false;
    }

    //permet de modifier la grille
    modif_grid(x, y, value) {
        this.grid[y][x] = value;
    }

    // affiche lors du clic sur une case les cases possibles et les pions qui peuvent être pris
    affiche(x_pos, y_pos) {
        // récupère la case
        let pion = this.getCaseState(x_pos, y_pos);
        let case_tmp;
        let list_deplacement = [];

        // vérifie que la case cliqué contient un pion
        if (pion != undefined && pion.color == this.getCurrentPlayer()) {
            // parcours la liste des possibilités de déplacements du pions
            for (let list_capa of pion.capacite_de_deplacement) {
                for (let capa of list_capa) {
                    // vérifie que les coordonnées sont dans le tableau
                    if ((capa[0] + pion.x).between(0, 7) && (capa[1] + pion.y).between(0, 7)) {
                        // récupère la case de la position
                        case_tmp = this.getCaseState(capa[0] + pion.x, capa[1] + pion.y);

                        // si le pion est de type Pion, alors on vérifie s'il peut se déplacer sur les côtés s'il peut manger un pion ennemis
                        if (pion.type == "Pion" && (capa == pion.capacite_de_deplacement[0][1] || capa == pion.capacite_de_deplacement[0][2])) {
                            // on vérifie que la case n'est pas vide
                            if (case_tmp != undefined) {
                                // on vérifie que la case contient un pion ennemi
                                if (case_tmp.color != pion.color) {
                                    list_deplacement.push([capa[0] + pion.x, capa[1] + pion.y]);
                                }
                            }
                        } else if (pion.type == "Pion" && capa == list_capa[0]) { // le pion ne peut pas manger en avant
                            // si la case est vide, alors je peux me déplacer dessus
                            if (case_tmp == undefined) {
                                list_deplacement.push([capa[0] + pion.x, capa[1] + pion.y]);
                            }
                            // sinon le pion ne peut pas avancer
                            else {
                                break;
                            }
                        } else if (case_tmp == undefined) { // si la case est vide, alors on peut se déplacer dessus
                            list_deplacement.push([capa[0] + pion.x, capa[1] + pion.y]);
                        } else if (case_tmp.color != pion.color) { // sinon on vérifie que c'est un pion ennemi
                            list_deplacement.push([capa[0] + pion.x, capa[1] + pion.y]);
                            break;
                        } else { // sinon c'est un pion allié, on ne peut pas le manger et il bloque cette direction
                            break;
                        }
                    }
                }
            }
        }

        return list_deplacement;
    }

    // déplace le pion et vérifie si un pion est mangé
    deplacement(x_clic, y_clic, x_pos, y_pos) {
        // récupère la case
        let pion = this.getCaseState(x_pos, y_pos);

        // on vérifie que la case de départ n'est pas vide
        if (pion != undefined) {
            // on récupère les endroits où le pion peut se déplacer
            let list_capa = this.affiche(pion.x, pion.y);

            // on parcours le tableau des positions possibles pour le pion de départ
            for (let pos_tmp of list_capa) {
                // on vérifie que la case cliqué appartient à la liste des positions de déplacement
                if (pos_tmp.join() == [x_clic, y_clic].join()) {
                    // si c'est un pion qui se déplace pour la première fois, alors il ne pourra plus se déplacer de deux cases an avant
                    if (pion.type == "Pion" && pion.capacite_de_deplacement[0].length == 4) {
                        pion.capacite_de_deplacement[0].pop();
                    }

                    // si la case sur laquelle on veut aller est un pion
                    if (this.getCaseState(x_clic, y_clic) != undefined) {
                        // alors on l'ajoute à la liste des pions mangés
                        this.pions_manges.push([this.getCaseState(x_clic, y_clic)]);
                    }

                    // modification des positions du pion et modification sur la grille
                    pion.x = x_clic;
                    pion.y = y_clic;
                    this.modif_grid(x_clic, y_clic, pion);
                    this.modif_grid(x_pos, y_pos, undefined);
                    this.tour++;
                    return true;
                }
            }
        }
        return false;
    }

    // mat
    isMat() {

    }

    // roi en echec
    isEchec() {

    }

    // retourne le joueur gagnant
    getWinner() {

    }
}