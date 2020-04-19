class EchecView {
    constructor(game, name, couleur, joueur1, joueur2) {
        this.game = game;
        this.name = name;
        this.couleur = couleur;
        this.game.joueur1 = joueur1;
        this.game.joueur2 = joueur2;
        this.click = []; // stocke les coordonnées du premier clic
        let tab = document.getElementById("tab"); // permet d'enlever le premier enfant texte du tableau
        tab.removeChild(tab.firstChild);
        this.modif_title();
        this.create_grid();
        this.affiche_pion();
        this.create_listeneurs();
        this.nom_joueur();
        /*this.game.affiche = function(x_pos, y_pos) {
            // récupère la case
            let pion = this.getCaseState(x_pos, y_pos);
            let case_tmp;
            let list_deplacement = [];
            let capa_copie;
    
            // vérifie que la case cliqué contient un pion
            if (pion != undefined && pion.color == game.tour % 2 && !this.isFinished()) {
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
        };
        this.game.getCaseState = function(x, y) {
            // vérifie que les coordonnées sont dans la grille
            if (x.between(0, 7) && y.between(0, 7)) {
                return this.grid[y][x];
            }
            // sinon la case n'existe pas
            return false;
        };
        this.game.isFinished = function() {
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
        };
        this.game.isMat = function(color) {
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
        };
        this.game.affiche_roi = function(x, y) {
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
        };
        this.game.modif_grid = function(x, y, value) {
            // vérifie que les coordonnées sont dans la grille
            if (x.between(0, 7) && y.between(0, 7)) {
                this.grid[y][x] = value;
                return true;
            }
            return false;
        };
        this.game.deplacement = function(x_clic, y_clic, x_pos, y_pos) {
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
        };
        this.game.new_dame = function(x, y) {
            let pion = this.getCaseState(x, y);
            // vérifie que le pion est de type Pion
            if (pion.type == "Pion") {
                // vérifie que le pion est au bout du plateau
                if ((pion.color == 0 && y == 0) || (pion.color == 1 && y == 7)) {
                    this.modif_grid(x, y, new Dame(pion.color, x, y));
                }
            }
            return false;
        };
        this.game.isEchec = function(x, y) {
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
        };*/
    }
    // modifie le titre de la page
    modif_title() {
        document.getElementById("titre").textContent = this.name;
    }

    // creer la grille
    create_grid() {
        let tab = document.getElementById("tab");
        let tr;
        let td;

        for (let i = 0; i < 8; ++i) {
            tr = document.createElement("tr");
            tab.appendChild(tr);
            for (let j = 0; j < 8; ++j) {
                td = document.createElement("td");
                // chaque case a une coordonnée dans son id yx avec l'origine en haut à gauche du tableau
                td.setAttribute("id", String(i) + String(j));

                if ((i % 2 == 0 && j % 2 == 1) || (i % 2 == 1 && j % 2 == 0)) {
                    td.setAttribute("class", "black")
                }

                tr.appendChild(td);
            }
        }
    }

    // affiche les images des pions
    affiche_pion() {
        let td;
        let img;
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                td = document.getElementById(String(i) + String(j));
                img = document.createElement('img');
                img.setAttribute("class", "pions");

                // teste en fonction de la grille du jeu quel image doit être placé
                if (this.game.grid[i][j] != undefined) {
                    img.setAttribute("src", "../img/" + ((this.game.grid[i][j].color) ? "noir" : "blanc") + "/" + String(this.game.grid[i][j].type) + ".png");
                    td.appendChild(img);
                }
            }
        }
    }

    // crée un listeneur par case du tableau
    create_listeneurs() {
        let tab = document.getElementById("tab");
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                tab.rows[i].cells[j].addEventListener('click', () => {
                    this.click_event(j, i);
                });
            }
        }
    }

    // lorsque l'on clique sur l'une des cases du tableau
    click_event(x, y) {
        // si on a déjà cliqué sur un pion, alors on déplace
        if (this.click.length != 0) {
            this.modif_grid(["deplace", x, y]);
            // affiche les scores
            this.score();
        }
        // sinon on affiche les cases où le pion cliqué peut se déplacer
        else {
            this.modif_grid(["affiche", x, y]);
        }

        // affiche le bouton reset
        this.bouton_reset();

        // affiche les pions mangés
        this.pions_manges();

        this.game.fini = undefined;
        if (this.game.isFinished()) this.affichage_gagnant();
        else this.nom_joueur();
    }

    // modifie la grille
    modif_grid(value) {
        // supprime tout et raffiche tout selon la grille
        if (value[0] == "refresh") {
            let tab = document.getElementById("tab");
            for (let i = 0; i < 8; ++i) {
                tab.removeChild(tab.firstChild);
            }
            this.create_grid();
            this.affiche_pion();
            this.create_listeneurs();
            this.pions_manges();
            this.score();
        }
        // affiche les positions où le joueur peut aller
        else if (value[0] == "affiche") {
            // on supprime toutes les cases possédant une couleur
            this.suppr_color("vert");
            this.suppr_color("rouge");

            let td;
            let list_possible = this.game.affiche(value[1], value[2]);
            for (let case_tmp of list_possible) {
                td = document.getElementById(String(case_tmp[1]) + String(case_tmp[0]));
                // on affiche toutes les cases vides où le joueur peut se déplacer en vert
                if (this.game.getCaseState(case_tmp[0], case_tmp[1]) == undefined) {
                    td.setAttribute("class", "vert");
                }
                // on affiche toutes les pions que le joueur peut prendre en rouge
                else {
                    td.setAttribute("class", "rouge");
                }
            }

            // on stocke les coordonnées du click
            this.click = [value[1], value[2]];
        }
        // déplace le pion
        else if (value[0] == "deplace") {
            // si le déplacement est possible
            if (this.game.deplacement(value[1], value[2], this.click[0], this.click[1])) {
                // on raffraichit la grille avec les nouveaux pions
                this.modif_grid("refresh");

                // supprime les couleurs déjà présentes
                this.suppr_color("vert");
                this.suppr_color("rouge");
                this.suppr_color("orange");

                // on récupère la case du clic
                let td_clic = document.getElementById(String(value[2]) + String(value[1]));

                // s'il y a déjà un pion sur cette case, on le supprime
                if (td_clic.firstChild != null) {
                    td_clic.removeChild(td_clic.firstChild);
                }

                // déplace l'image de la case d'origine vers la case d'arrivé
                let img = document.createElement('img');
                img.setAttribute("class", "pions");

                // teste en fonction de la grille du jeu quel image doit être placé
                if (this.game.grid[value[2]][value[1]] != undefined) {
                    img.setAttribute("src", "../img/" + ((this.game.grid[value[2]][value[1]].color) ? "noir" : "blanc") + "/" + String(this.game.grid[value[2]][value[1]].type) + ".png");
                    td_clic.appendChild(img);
                }

                let td;
                td = document.getElementById(String(this.click[1]) + String(this.click[0]));
                td.removeChild(td.firstChild);

                // supprime le stockage des coordonnées précédentes
                this.click = [];

                // rajoute une couleur orange sous le pion qui vient d'être joué
                td_clic.setAttribute("class", "orange");
            }
            // si on ne peut pas jouer, alors on affiche les cases où le nouveau pion cliqué
            else {
                this.modif_grid(["affiche", value[1], value[2]]);
            }
        }
    }

    // supprime la couleur color sur la grisse
    suppr_color(color) {
        while (document.getElementsByClassName(color).length != 0) {
            let td = document.getElementsByClassName(color);
            this.color_black(td);
        }
    }

    // remplace la case de départ et rajoute la couleur de la case en noir si besoin
    color_black(td) {
        let unite = td[0].id % 10;
        let dizaine = (td[0].id - td[0].id % 10) / 10;

        let new_td = document.createElement("td");
        new_td.setAttribute("id", td[0].id);

        if ((dizaine % 2 == 0 && unite % 2 == 1) || (dizaine % 2 == 1 && unite % 2 == 0)) {
            new_td.setAttribute("class", "black");
        }

        new_td.addEventListener('click', () => {
            this.click_event(unite, dizaine);
        });

        if (td[0].firstChild != null) {
            new_td.append(td[0].firstChild);
        }

        td[0].replaceWith(new_td);

        return true;
    }

    // affiche le nom du joueur qui peut jouer
    nom_joueur() {
        /*if (this.game.echec[0]) {
            if (this.game.getCurrentPlayer() == 0) document.getElementById("joueur").textContent = "Le joueur " + this.game.joueur_blanc.pseudo + " est en échec";
            else document.getElementById("joueur").textContent = "Le joueur " + this.game.joueur_noir.pseudo + " est en échec ";
        } else {
            if (this.game.getCurrentPlayer() == 0) document.getElementById("joueur").textContent = "Au tour de " + this.game.joueur_blanc.pseudo + " ";
            else document.getElementById("joueur").textContent = "Au tour de " + this.game.joueur_noir.pseudo + " ";
        }*/
        if (this.game.echec[0]) {
            if (this.game.tour % 2 == 0) document.getElementById("joueur").textContent = "Le joueur " + this.game.joueur_blanc.pseudo + " est en échec";
            else document.getElementById("joueur").textContent = "Le joueur " + this.game.joueur_noir.pseudo + " est en échec ";
        } else {
            if (this.game.tour % 2 == 0) document.getElementById("joueur").textContent = "Au tour de " + this.game.joueur_blanc.pseudo + " ";
            else document.getElementById("joueur").textContent = "Au tour de " + this.game.joueur_noir.pseudo + " ";
        }
        /*console.log("échec ? " + this.game.echec[0]);
        if (this.game.echec[0]) { // 1) s'il y a échec...
            if (this.game.tour % 2 == 0) { // 2) ...que c'est au tour du joueur blanc...
                if (this.couleur == 0) document.getElementById("joueur").textContent = "Vous êtes en échec "; // 3) ...et que je suis le joueur blanc 
                else document.getElementById("joueur").textContent = "Le joueur adverse est en échec "; // 3) ...et que je ne suis pas le joueur blanc
            } 
            else if (this.couleur == 1) document.getElementById("joueur").textContent = "Vous êtes en échec "; // 2) ...que c'est au tour du joueur noir et que je suis le joueur noir
            else document.getElementById("joueur").textContent = "Le joueur adverse est en échec "; // 2) ...que c'est au tour du joueur noir et que je ne suis pas le joueur noir
        } else { // 1) s'il n'y a pas échec
            console.log("tour ? " + this.game.tour);
            if (this.game.tour % 2 == 0) { // 2) ...que c'est au tour du joueur blanc...
                console.log("couleur ? " + this.couleur);
                if (this.couleur == 0) document.getElementById("joueur").textContent = "À votre tour "; // 3) ...et que je suis le joueur blanc 
                else document.getElementById("joueur").textContent = "Au tour de " + this.game.joueur_blanc.pseudo + " ";// 3) ...et que je ne suis pas le joueur blanc
            }
            else if (this.couleur == 1) document.getElementById("joueur").textContent = "À votre tour "; // 2) ...que c'est au tour du joueur noir et que je suis le joueur noir
            else document.getElementById("joueur").textContent = "Au tour de " + this.game.joueur_noir.pseudo + " ";// 3) ...et que je ne suis pas le joueur noir
        }*/
        this.blason();
    }

    // affiche les scores
    score() {
        document.getElementById("score_blanc").textContent = String(this.game.joueur_blanc.points);
        document.getElementById("score_noir").textContent = String(this.game.joueur_noir.points);
    }

    // affiche l'image du joueur qui peut jouer
    blason() {
        // supprime l'image existante
        if (document.getElementsByClassName("blason")[0] != undefined) {
            document.getElementsByClassName("blason")[0].remove();
        }

        // affiche l'image
        let currentDiv = document.getElementById("joueur");

        let img = document.createElement("img");
        currentDiv.parentElement.appendChild(img);
        img.setAttribute('class', 'blason');

        // on définit quel est l'image que l'on doit afficher
        img.setAttribute('src', '../img/blason_du_joueur/joueur' + String(this.game.tour % 2 + 1) + '.png');
    }

    // affiche les pions mangés
    pions_manges() {
        // supprime tous les pions mangés
        while (document.getElementsByClassName("mange")[0] != undefined) {
            document.getElementsByClassName("mange")[0].remove();
        }

        let div;
        let img_pion;
        // rajoute chaque pion mangé du côté du joueur qui l'a mangé
        for (let pion of this.game.pions_manges) {
            div = document.getElementById("mange_" + ((pion[0].color) ? "noir" : "blanc"));

            img_pion = document.createElement("img");
            img_pion.setAttribute('class', 'mange');
            div.appendChild(img_pion);

            img_pion.setAttribute("src", "../img/" + ((pion[0].color) ? "noir" : "blanc") + "/" + String(pion[0].type) + ".png");
        }

        // rajoute un transparent si besoin (permet d'éviter que la ligne des pions se crée uniquement lorsqu'un nouveau pion est mangé
        div = 0;
        if (document.getElementById("mange_blanc").childElementCount == 0) {
            div = document.getElementById("mange_blanc");
        } else if (document.getElementById("mange_noir").childElementCount == 0) {
            div = document.getElementById("mange_noir");
        }
        if (div != 0) {
            img_pion = document.createElement("img");
            img_pion.setAttribute('class', 'mange');
            div.appendChild(img_pion);

            img_pion.setAttribute("src", "../img/transparent.png");
        }
    }

    // affiche le gagnant ou s'il y a égalité
    affichage_gagnant() {
        this.game.fini = undefined;
        // cas où le jeu est fini mais qu'il y a égalité
        if (this.game.egalite) {
            // supprime l'image qui indique à qui le tour est
            if (document.getElementsByClassName("blason")[0] != undefined) {
                document.getElementsByClassName("blason")[0].remove();
            }
            document.getElementById("joueur").textContent = "Il y a pat ! ";
        }
        // affiche le joueur qui a gagné
        else if (this.game.isFinished()) {
            // cas où le joueur noir est mat
            if (this.game.isMat(0)[0]) {
                document.getElementById("joueur").textContent = this.game.joueur_blanc.pseudo + " a gagné ! " + this.game.joueur_noir.pseudo + " est échec et mat ! ";
            }
            // cas où le joueur blanc est mat
            else if (this.game.isMat(1)[0]) {
                document.getElementById("joueur").textContent = this.game.joueur_noir.pseudo + " a gagné ! " + this.game.joueur_blanc.pseudo + " est échec et mat ! ";
            } else {
                if (this.game.getWinner()) document.getElementById("joueur").textContent = this.game.joueur_blanc.pseudo + " a gagné ! ";
                else if (!this.game.getWinner()) document.getElementById("joueur").textContent = this.game.joueur_noir.pseudo + " a gagné ! ";
            }
        }
    }

    // affiche une image qui permet de relancer le jeu
    bouton_reset() {
        // on affiche pas l'image si le jeu n'a pas commencé
        if ((this.game.isFinished() || this.game.tour != 0) && document.getElementsByClassName("reset").length == 0) {
            let currentDiv = document.getElementsByClassName('masthead')[0];

            // permet de centrer le bouton
            let center = document.createElement("center");
            currentDiv.appendChild(center);

            let img = document.createElement("img");
            center.appendChild(img);
            img.setAttribute('src', '../img/bouton.png');
            img.setAttribute('class', 'reset');

            // remet l'event du click sur l'image
            img.addEventListener('click', () => {
                this.game.reset();
                img.remove();
                this.modif_grid(["refresh"]);
                this.nom_joueur();
            })
        }
    }
}