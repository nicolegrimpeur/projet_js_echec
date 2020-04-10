class EchecView {
    constructor(game, name) {
        this.game = game;
        this.name = name;
        this.click = []; // stocke les coordonnées du premier clic
        let tab = document.getElementById("tab"); // permet d'enlevr le premier enfant texte du tableau
        tab.removeChild(tab.firstChild);
        this.create_grid();
        this.affiche_pion();
        this.create_listeneurs();

        // this.nom_joueur();
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
                    if (this.game.grid[i][j].type == "Roi") {
                        img.setAttribute("src", "./images/roi.png");
                    }
                    if (this.game.grid[i][j].type == "Dame") {
                        img.setAttribute("src", "./images/dame.png");
                    }
                    if (this.game.grid[i][j].type == "Cavalier") {
                        img.setAttribute("src", "./images/cavalier.png");
                    }
                    if (this.game.grid[i][j].type == "Fou") {
                        img.setAttribute("src", "./images/fou.png");
                    }
                    if (this.game.grid[i][j].type == "Tour") {
                        img.setAttribute("src", "./images/tour.png");
                    }
                    if (this.game.grid[i][j].type == "Pion") {
                        img.setAttribute("src", "./images/pion.png");
                    }
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
        }
        // sinon on affiche les cases où le pion cliqué peut se déplacer
        else {
            this.modif_grid(["affiche", x, y]);
        }
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
        }
        // affiche les positions où le joueur peut aller
        else if (value[0] == "affiche") {
            let td;

            // on supprime toutes les cases possédant une couleur
            while (document.getElementsByClassName("vert").length != 0) {
                td = document.getElementsByClassName("vert");
                td[0].removeAttribute("class");
            }

            while (document.getElementsByClassName("rouge").length != 0) {
                td = document.getElementsByClassName("rouge");
                td[0].removeAttribute("class");
            }

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

                // supprime le stockage des coordonnées précédentes
                this.click = [];

                // supprime les couleurs déjà présentes
                let td;
                while (document.getElementsByClassName("vert").length != 0) {
                    td = document.getElementsByClassName("vert");
                    td[0].removeAttribute("class");
                }

                while (document.getElementsByClassName("rouge").length != 0) {
                    td = document.getElementsByClassName("rouge");
                    td[0].removeAttribute("class");
                }

                while (document.getElementsByClassName("orange").length != 0) {
                    td = document.getElementsByClassName("orange");
                    td[0].removeAttribute("class");
                }

                // rajoute une couleur orange sous le pion qui vient d'être joué
                td = document.getElementById(String(value[2]) + String(value[1]));
                td.setAttribute("class", "orange");
            }
            // si on ne peut pas jouer, alors on affiche les cases où le nouveau pion cliqué
            else {
                this.modif_grid(["affiche", value[1], value[2]]);
            }
        }
    }
}