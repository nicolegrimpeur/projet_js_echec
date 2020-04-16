import("./Pions.js");

class Echec {
    constructor() {
        this.grid = new Array(8); // tableau de position en 3*3
        this.init_grid();
        this.reset();
        this.tour = 0; // nombre pair : joueur 0, nombre impair : joueur 1
        this.currentPlayer = 0;
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
            this.grid[6][i] = new Pion(1, i, 6);
        }

        for (let i = 2; i <= 5; ++i) {
            for (let j = 0; j <= 7; ++j) {
                this.grid[i][j] = undefined;
            }
        }

        console.log(this.grid);
        this.tour = 0;
        this.currentPlayer = 0;
    }

    // renvoi le joueur
    getCurrentPlayer() {
        return (this.tour % 2);
    }

    // renvoi l'etat d'une case
    getCaseState(x, y) {
        return this.grid[x][y];
    }
}