class EchecView {
    constructor(game, name) {
        this.game = game;
        this.name = name;
        this.click = []; // stocke les coordonnées du premier clic
        let tab = document.getElementById("tab"); // permet d'enlever le premier enfant texte du tableau
        tab.removeChild(tab.firstChild);
        this.create_grid();
        this.affiche_pion();
        this.create_listeneurs();

        this.nom_joueur();
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
                    if (this.game.grid[i][j].color == 0) {
                        img.setAttribute("src", "../img/blanc/" + String(this.game.grid[i][j].type) + ".png");
                    } else {
                        img.setAttribute("src", "../img/noir/" + String(this.game.grid[i][j].type) + ".png");
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
            let td;

            // on supprime toutes les cases possédant une couleur
            while (document.getElementsByClassName("vert").length != 0) {
                td = document.getElementsByClassName("vert");
                this.color_black(td);
            }

            while (document.getElementsByClassName("rouge").length != 0) {
                td = document.getElementsByClassName("rouge");
                this.color_black(td);
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

                // supprime les couleurs déjà présentes
                let td;
                while (document.getElementsByClassName("vert").length != 0) {
                    td = document.getElementsByClassName("vert");
                    this.color_black(td);
                }

                while (document.getElementsByClassName("rouge").length != 0) {
                    td = document.getElementsByClassName("rouge");
                    this.color_black(td);
                }

                while (document.getElementsByClassName("orange").length != 0) {
                    td = document.getElementsByClassName("orange");
                    this.color_black(td);
                }

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
                    if (this.game.grid[value[2]][value[1]].color == 0) {
                        img.setAttribute("src", "../img/blanc/" + String(this.game.grid[value[2]][value[1]].type) + ".png");
                    } else {
                        img.setAttribute("src", "../img/noir/" + String(this.game.grid[value[2]][value[1]].type) + ".png");
                    }
                    td_clic.appendChild(img);
                }

                td = document.getElementById(String(this.click[1]) + String(this.click[0]));
                td.removeChild(td.firstChild);

                // supprime le stockage des coordonnées précédentes
                this.click = [];

                // rajoute une couleur orange sous le pion qui vient d'être joué
                td_clic.setAttribute("class", "orange");

                // if (this.game.echec[0]) {
                //     this.modif_grid(["affiche", ])
                // }
            }
            // si on ne peut pas jouer, alors on affiche les cases où le nouveau pion cliqué
            else {
                this.modif_grid(["affiche", value[1], value[2]]);
            }
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
        if (this.game.echec[0]) {
            if (this.game.getCurrentPlayer() == 0) document.getElementById("joueur").textContent = "Le joueur " + this.game.joueur_blanc.pseudo + " est en echec";
            else document.getElementById("joueur").textContent = "Le joueur " + this.game.joueur_noir.pseudo + " est en echec ";
        } else {
            if (this.game.getCurrentPlayer() == 0) document.getElementById("joueur").textContent = "Au tour de " + this.game.joueur_blanc.pseudo + " ";
            else document.getElementById("joueur").textContent = "Au tour de " + this.game.joueur_noir.pseudo + " ";
        }
        this.blason();
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
        if (this.game.getCurrentPlayer() == 0) img.setAttribute('src', '../img/blason_du_joueur/joueur1.png');
        else img.setAttribute('src', '../img/blason_du_joueur/joueur2.png');
    }

    // affiche le gagnant ou s'il y a égalité
    affichage_gagnant() {
        this.game.fini = undefined;
        if (this.game.isFinished()) {
            // affiche le joueur qui a gagné
            if (this.game.isMat(0)[0]) {
                document.getElementById("joueur").textContent = this.game.joueur_blanc.pseudo + " a gagné ! " + this.game.joueur_noir.pseudo + " est echec et mat ! ";
            }
            else if (this.game.isMat(1)[0]) {
                document.getElementById("joueur").textContent = this.game.joueur_noir.pseudo +" a gagné ! " + this.game.joueur_blanc.pseudo + " est echec et mat ! ";
            } else {
                if (this.game.getWinner()) document.getElementById("joueur").textContent = this.game.joueur_blanc.pseudo + " a gagné ! ";
                else if (!this.game.getWinner()) document.getElementById("joueur").textContent = this.game.joueur_noir.pseudo + " a gagné ! ";
            }
        } else {
            // supprime l'image qui indique à qui le tour est
            if (document.getElementsByClassName("blason")[0] != undefined) {
                document.getElementsByClassName("blason")[0].remove();
            }
            document.getElementById("joueur").textContent = "Il y a égalité ! ";
        }
    }

    // affiche les pions mangés
    pions_manges() {
        while (document.getElementsByClassName("mange")[0] != undefined) {
            document.getElementsByClassName("mange")[0].remove();
        }

        let div;
        let img_pion;
        for (let pion of this.game.pions_manges) {
            div = document.getElementById("mange_" + ((pion[0].color) ? "noir" : "blanc"));

            img_pion = document.createElement("img");
            img_pion.setAttribute('class', 'mange');
            div.appendChild(img_pion);

            img_pion.setAttribute("src", "../img/" + ((pion[0].color) ? "noir" : "blanc") + "/" + String(pion[0].type) + ".png");
        }

        if (document.getElementById("mange_blanc").childElementCount == 0) {
            div = document.getElementById("mange_blanc");

            img_pion = document.createElement("img");
            img_pion.setAttribute('class', 'mange');
            div.appendChild(img_pion);

            img_pion.setAttribute("src", "../img/transparent.png");
        }
        else if (document.getElementById("mange_noir").childElementCount == 0) {
            div = document.getElementById("mange_noir");

            img_pion = document.createElement("img");
            img_pion.setAttribute('class', 'mange');
            div.appendChild(img_pion);

            img_pion.setAttribute("src", "../img/transparent.png");
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

            img.addEventListener('click', () => {
                this.game.reset();
                img.remove();
                this.modif_grid(["refresh"]);
                this.nom_joueur();
            })
        }
    }

    // affiche les scores
    score() {
        document.getElementById("score_blanc").textContent = String(this.game.joueur_blanc.points);
        document.getElementById("score_noir").textContent = String(this.game.joueur_noir.points);
    }
}