class EchecView {
    constructor(game, name) {
        this.game = game;
        this.name = name;
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
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                if (this.game.grid[i][j].type == "Roi") {

                }
                if (this.game.grid[i][j].type == "Dame") {

                }
                if (this.game.grid[i][j].type == "Cavalier") {

                }
                if (this.game.grid[i][j].type == "Fou") {

                }
                if (this.game.grid[i][j].type == "Tour") {

                }
                if (this.game.grid[i][j].type == "Pion") {

                }
                console.log(this.game.grid[i][j]);
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
        this.modif_grid("refresh");
    }

    // modifie la grille
    modif_grid(value) {
        if (value == "refresh") {
            let tab = document.getElementById("tab");
            for (let i = 0; i < 8; ++i) {
                tab.removeChild(tab.firstChild);
            }
            this.create_grid();
        }
    }
}