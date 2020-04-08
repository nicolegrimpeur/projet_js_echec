import("./Pions.js");

class Echec {
    constructor() {
        this.grid = new Array(8); // tableau de position en 3*3
        this.init_grid();
        this.reset();
        this.tour = 0; // nombre pair : joueur 0, nombre impair : joueur 1
        this.currentPlayer = 0;
        this.pions_manges = [];
    }

    // initialise la taille de la liste grid
    init_grid () {
        for (let i = 0; i < 8; ++i) {
            this.grid[i] = Array(8);
        }
    }

    // remet à 0 le tableau grid et les variables utiles
    reset() {
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
        this.currentPlayer = 0;
        this.pions_manges = [];
    }

    // renvoi le joueur
    getCurrentPlayer() {
        return (this.tour % 2);
    }

    // renvoi l'etat d'une case
    getCaseState(x, y) {
        if (x.between(0, 7) && y.between(0, 7)) {
            return this.grid[y][x];
        }
        return false;
    }

    //permet de modifier la grille
    modif_grid(x, y, value) {
        this.grid[y][x] = value;
    }

    // affiche lors du clic sur une case les cases possibles et les pions qui peuvent être pris
    affiche(x_pos, y_pos) {
        let pion = this.getCaseState(x_pos, y_pos);
        let case_tmp;
        let list_deplacement = [];

        if (pion != undefined) {
            for (let list_capa of pion.capacite_de_deplacement) {
                for (let capa of list_capa) {
                    if ((capa[0] + pion.x).between(0, 7) && (capa[1] + pion.y).between(0, 7)) {
                        case_tmp = this.getCaseState(capa[0] + pion.x, capa[1] + pion.y);
                        if (pion.type == "Pion" && (capa == pion.capacite_de_deplacement[0][1] || capa == pion.capacite_de_deplacement[0][2])) {
                            if (case_tmp != undefined) {
                                if (case_tmp.color != pion.color) {
                                    list_deplacement.push([capa[0] + pion.x, capa[1] + pion.y]);
                                }
                            }
                        } else if (case_tmp == undefined) {
                            list_deplacement.push([capa[0] + pion.x, capa[1] + pion.y]);
                        } else if (case_tmp.color != pion.color) {
                            list_deplacement.push([capa[0] + pion.x, capa[1] + pion.y]);
                            break;
                        } else {
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
        let pion = this.getCaseState(x_pos, y_pos);
        let list_capa = this.affiche(pion.x, pion.y);

        for (let pos_tmp of list_capa) {
            if (pos_tmp.join() == [x_clic, y_clic].join()) {
                if (pion.type == "Pion" && pion.capacite_de_deplacement[0].length == 4 && pion.capacite_de_deplacement[0][3][0] == pos_tmp[0] - x_pos && pion.capacite_de_deplacement[0][3][1] == pos_tmp[1] - y_pos) {
                    pion.capacite_de_deplacement[0].pop();
                }
                if (this.getCaseState(x_clic, y_clic) != undefined) {
                    this.pions_manges.push([this.getCaseState(x_clic, y_clic)]);
                }
                pion.x = x_clic;
                pion.y = y_clic;
                this.modif_grid(x_clic, y_clic, pion);
                this.modif_grid(x_pos, y_pos, undefined);
                return true;
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