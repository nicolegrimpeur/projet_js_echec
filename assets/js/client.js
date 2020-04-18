import("./getParam.js");

var pseudo = $_GET('pseudo'), couleur = $_GET('couleur'); // récupère le pseudo et la couleur du joueur

console.log(pseudo + " " + couleur);

if (pseudo != null) { // remplacement du message d'acceuil
    document.getElementById("hello").textContent = "Salutation " + pseudo + " !";
    if (couleur != "lambda") document.getElementById("choix").textContent = "Tu as choisi les " + couleur;
    else document.getElementById("choix").textContent = "Tu as choisi une couleur aléatoire";
    //document.getElementById("choix").insertAdjacentText("afterend", "Tu as choisi les " + couleur);
    document.getElementById("pseudo").setAttribute("value", pseudo);
    document.getElementById("couleur").setAttribute("value", couleur);
}


(function () {
    const socket = io.connect('http://localhost:8100');

    socket.on('Hello' , (message) => {
        console.log('Le serveur a un message pour vous : ' + message);
    });
    

    function clicked() {
        console.log('clicked');
        socket.emit('private message', pseudo , 'Salut serveur, ça va ?');
    };

    document.getElementById('clicked').addEventListener('click', clicked);
})();