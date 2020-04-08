class EchecView {
    constructor(game, name) {
        this.game = game;
        console.log(this.game.grid[0][0].type);
        this.name = name;
        this.click = 0;
        this.create_grid();
        this.affiche_pion();
        this.create_listeneurs();
        // this.nom_joueur();
    }

    create_grid() {
        let tab = document.getElementById("tab");
        let tr;
        let td;

        for (let i = 0; i < 8; ++i) {
            tr = document.createElement("tr");
            tab.appendChild(tr);
            for (let j = 0; j < 8; ++j) {
                td = document.createElement("td");
                td.setAttribute("id", String(i) + String(j));
                tr.appendChild(td);
            }
        }
    }

    affiche_pion() {
        let td;
        let img;
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                td = document.getElementById(String(i) + String(j));
                img = document.createElement('img');
                img.setAttribute("class", "pions");

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
        // this.game.affiche(x, y);

        console.log("click", x, y);
        console.log(this.game.getCaseState(x, y));
        // this.modif_grid(["refresh"]);
        this.modif_grid(["affiche", x, y]);
    }

    // modifie la grille
    modif_grid(value) {
        if (value[0] == "refresh") {
            let tab = document.getElementById("tab");
            for (let i = 0; i <= 8; ++i) {
                tab.removeChild(tab.firstChild);
            }
            this.create_grid();
            this.affiche_pion();
        }
        else if (value[0] == "affiche") {

            let list_possible = this.game.affiche(value[1], value[2]);
            // console.log(list_possible);


        }
    }
}