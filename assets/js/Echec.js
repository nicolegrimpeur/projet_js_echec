import("./Pions.js");

class Echec {
    constructor(joueur1, joueur2) {
        this.grid; // tableau de position en 8*8
        this.grid_default;
        this.tour = 0; // nombre pair : joueur 0, nombre impair : joueur 1
        this.pions_manges = []; // stocke les pions qui ont été mangé
        this.echec = [false]; // stock si le roi est en echec ou non et quel pion le menace
        this.deja_dans_affiche = false;
        this.mat = undefined;
        this.fini = undefined;
        if (joueur1.couleur == 0) {
            this.joueur_blanc = joueur1;
            this.joueur_noir = joueur2;
        } else {
            this.joueur_blanc = joueur2;
            this.joueur_noir = joueur1;
        }
        this.egalite = false;
        this.init_grid();
        this.reset();
        this.joueur_blanc.ajout_points = function(type) {
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
        };
        this.joueur_noir.ajout_points = function(type) {
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
        };
    }
    
    // initialise la taille de la liste grid
    init_grid() {
        this.grid_default = new Array(8);

        for (let i = 0; i < 8; ++i) {
            this.grid_default[i] = new Array(8);
        }
        this.grid_default[0][0] = new Tour(1, 0, 0);
        this.grid_default[0][1] = new Cavalier(1, 1, 0);
        this.grid_default[0][2] = new Fou(1, 2, 0);
        this.grid_default[0][3] = new Dame(1, 3, 0);
        this.grid_default[0][4] = new Roi(1, 4, 0);
        this.grid_default[0][5] = new Fou(1, 5, 0);
        this.grid_default[0][6] = new Cavalier(1, 6, 0);
        this.grid_default[0][7] = new Tour(1, 7, 0);
        for (let i = 0; i <= 7; ++i) {
            this.grid_default[1][i] = new Pion(1, i, 1);
        }

        this.grid_default[7][0] = new Tour(0, 0, 7);
        this.grid_default[7][1] = new Cavalier(0, 1, 7);
        this.grid_default[7][2] = new Fou(0, 2, 7);
        this.grid_default[7][3] = new Dame(0, 3, 7);
        this.grid_default[7][4] = new Roi(0, 4, 7);
        this.grid_default[7][5] = new Fou(0, 5, 7);
        this.grid_default[7][6] = new Cavalier(0, 6, 7);
        this.grid_default[7][7] = new Tour(0, 7, 7);
        for (let i = 0; i <= 7; ++i) {
            this.grid_default[6][i] = new Pion(0, i, 6);
        }

        for (let i = 2; i <= 5; ++i) {
            for (let j = 0; j <= 7; ++j) {
                this.grid_default[i][j] = undefined;
            }
        }
        return this.grid_default;
    }

    // remet à 0 le tableau grid et les variables utiles
    reset() {
        // positions des pions sur un jeu d'echec classique
        this.grid = this.grid_default;

        // remet à 0 les différentes variables
        this.tour = 0;
        this.pions_manges = [];
        this.mat = undefined;
        this.fini = undefined;
        this.echec = [false];
        this.egalite = false;
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
        // vérifie que les coordonnées sont dans la grille
        if (x.between(0, 7) && y.between(0, 7)) {
            this.grid[y][x] = value;
            return true;
        }
        return false;
    }

    // affiche lors du clic sur une case les cases possibles et les pions qui peuvent être pris
    affiche(x_pos, y_pos) {
        // récupère la case
        let pion = this.getCaseState(x_pos, y_pos);
        let case_tmp;
        let list_deplacement = [];
        let capa_copie;

        // vérifie que la case cliqué contient un pion
        if (pion != undefined && pion.color == this.getCurrentPlayer() && !this.isFinished()) {
            capa_copie = pion.capacite_de_deplacement;

            // si le pion est un roi, il execute la fonction affiche_roi qui récupère les positions où il n'est pas echec
            if (pion.type == "Roi" && !this.deja_dans_affiche) {
                this.deja_dans_affiche = true;
                capa_copie = this.affiche_roi(pion.x, pion.y);
                this.deja_dans_affiche = false;
            }

            // parcours la liste des possibilités de déplacements du pions
            for (let list_capa of capa_copie) {
                for (let capa of list_capa) {
                    // vérifie que les coordonnées sont dans le tableau
                    if ((capa[0] + pion.x).between(0, 7) && (capa[1] + pion.y).between(0, 7)) {
                        // récupère la case de la position
                        case_tmp = this.getCaseState(capa[0] + pion.x, capa[1] + pion.y);

                        // si le pion est de type Pion, alors on vérifie s'il peut se déplacer sur les côtés s'il peut manger un pion ennemis
                        if (pion.type == "Pion" && (capa == capa_copie[0][1] || capa == capa_copie[0][2])) {
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
                    
                    let case_mange = this.getCaseState(x_clic, y_clic);
                    // si la case sur laquelle on veut aller est un pion
                    if (case_mange != undefined) {
                        // alors on l'ajoute à la liste des pions mangés
                        this.pions_manges.push([case_mange]);

                        // si le pion mangé est noir, alors je rajoute des points au joueur blanc
                        if (case_mange.color) this.joueur_blanc.ajout_points(case_mange.type);
                        else this.joueur_noir.ajout_points(case_mange.type);
                    }

                    // modification des positions du pion et modification sur la grille
                    pion.x = x_clic;
                    pion.y = y_clic;
                    this.modif_grid(x_clic, y_clic, pion);
                    this.modif_grid(x_pos, y_pos, undefined);
                    this.tour++;

                    // rajoute une dame à la place d'un pion qui est arrivé au bout du terrain
                    this.new_dame(x_clic, y_clic);

                    // test si le roi est en echec
                    this.isEchec(x_clic, y_clic);
                    this.mat = undefined;
                    this.fini = undefined;
                    return true;
                }
            }
        }
        return false;
    }

    // permet de calculer les possibilités de déplacement du roi au position x, y
    affiche_roi(x, y) {
        let pion = this.getCaseState(x, y);
        if (pion != undefined) {
            // copie la capacité de déplacement du pion
            let list_deplacement = this.getCaseState(x, y).capacite_de_deplacement.slice();
            let echec_tmp = this.echec;
            let list_echec = [];
            let x_tmp;
            let y_tmp;
            let pion_tmp;
            this.echec = [false];

            // passe la case de départ sur undefined
            this.modif_grid(x, y, undefined);
            // parcours les listes de déplacement du roi pour savoir s'il peut se déplacer dessus ou non
            for (let position_roi = 0; position_roi < list_deplacement.length; ++position_roi) {
                x_tmp = list_deplacement[position_roi][0][0] + x;
                y_tmp = list_deplacement[position_roi][0][1] + y;
                // vérifie que la case temporaire du roi est une case vide et ne contient pas de pion allié
                if (this.getCaseState(x_tmp, y_tmp) == undefined || this.getCaseState(x_tmp, y_tmp).color != pion.color) {
                    pion_tmp = this.getCaseState(x_tmp, y_tmp);
                    // on déplace le roi sur la case temporaire
                    if (this.modif_grid(x_tmp, y_tmp, pion)) {

                        // on vérifie qu'aucun pion ne met en danger le roi
                        for (let j = 0; j < 8; ++j) {
                            for (let i = 0; i < 8; ++i) {
                                if (i != x || j != y) {
                                    // si la case met en echec le roi, alors il ne peut pas se déplacer dessus
                                    if (this.isEchec(i, j)) {
                                        list_echec.push([x_tmp, y_tmp]);
                                    }
                                }
                            }
                        }

                        // on replace la case de départ et on supprime le roi de cette case
                        this.modif_grid(x_tmp, y_tmp, pion_tmp);
                    }
                }
            }
            // on replace le roi à sa position initiale
            this.modif_grid(x, y, pion);

            // case à suppr contient les indices des cases de la liste de déplacement du roi à supprimer
            let case_a_suppr = [];
            for (let case_echec of list_echec) {
                for (let compteur = 0; compteur < list_deplacement.length; ++compteur) {
                    if (case_echec[0] == (list_deplacement[compteur][0][0] + x) && case_echec[1] == (list_deplacement[compteur][0][1] + y)) {
                        if (case_a_suppr.indexOf(compteur) == -1) case_a_suppr.push(compteur);
                    }
                }
            }

            // on trie la liste de manière décroissante
            case_a_suppr.sort();
            case_a_suppr.reverse();

            // on supprime les éléments correspondant aux indices à supprimer
            for (let ind of case_a_suppr) {
                list_deplacement.splice(ind, 1);
            }

            this.echec = echec_tmp;
            return list_deplacement;
        }
        return [];
    }

    // fonction qui ajoute la dame lorsque l'on arrive au bout du plateau
    new_dame(x, y) {
        let pion = this.getCaseState(x, y);
        // vérifie que le pion est de type Pion
        if (pion.type == "Pion") {
            // vérifie que le pion est au bout du plateau
            if ((pion.color == 0 && y == 0) || (pion.color == 1 && y == 7)) {
                this.modif_grid(x, y, new Dame(pion.color, x, y));
            }
        }
        return false;
    }

    // cherche si le pion demandé met en echec le roi ou non
    isEchec(x, y) {
        this.tour--;
        let list_pions = this.affiche(x, y);
        this.tour++;

        let pion;
        // parcours les positions où le pion peut se déplacer
        for (let case_tmp of list_pions) {
            pion = this.getCaseState(case_tmp[0], case_tmp[1]);
            if (pion != undefined) {
                // si un roi est dessus, alors le roi est echec
                if (pion.type == "Roi" && pion.color != this.getCaseState(x, y).color) {
                    this.echec[0] = true;
                    this.echec.push([x, y]);
                    return true;
                }
            }
        }
        this.echec = [false];
        return false;
    }

    // peremt de savoir si le roi de la couleur color est mat ou non
    isMat(color) {
        // this.mat permet de vérifier que la fonction n'a pas déjà été effectué dans le tour
        if (this.mat == undefined) {
            let pion;
            // parcours toutes les cases du plateau
            for (let j = 0; j < 8; ++j) {
                for (let i = 0; i < 8; ++i) {
                    pion = this.getCaseState(i, j);
                    if (pion != undefined) {
                        // si le pion est un roi et de la même couleur que color
                        if (pion.type == "Roi" && pion.color == color) {
                            if (this.affiche(i, j).length == 0 && this.echec[0]) {
                                this.mat = true;
                                return [true, pion.color, i, j];
                            }
                        }
                    }
                }
            }
            this.mat = false;
        }
        return [this.mat];
    }

    // détermine s'il y a un gagnant ou non
    isFinished() {
        // this.fini permet de savoir si l'on a déjà effectué la boucle ou non
        if (this.fini == undefined) {
            this.fini = false;
            // cas où l'un des rois est mat
            if (this.isMat(0)[0] || this.isMat(1)[0]) {
                this.fini = true;
                return true;
            }
            // cas où il ne reste que les deux rois sur le terrain, il y a égalité
            if (this.pions_manges.length == 30) {
                this.fini = true;
                this.egalite = true;
                return true;
            }
            // si un des rois a été mangé, alors le jeu est fini
            for (let pion of this.pions_manges) {
                if (pion[0].type == "Roi") {
                    this.fini = true;
                    return true;
                }
            }
        }
        return this.fini;
    }

    // retourne le joueur gagnant
    getWinner() {
        // le gagnant est le dernier joueur à avoir joué
        return this.getCurrentPlayer();
    }
}