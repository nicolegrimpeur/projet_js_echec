function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);
 	if ( param ) return vars[param] ? vars[param] : null;
	return vars;
};

var pseudo = $_GET('pseudo'), couleur = $_GET('couleur');

console.log(pseudo + " " + couleur);

if (pseudo != null) { // remplacement du message d'acceuil
    document.getElementById("Hello").textContent = "Salutation " + pseudo + " !";
    document.getElementById("Hello").insertAdjacentText("afterend", "Tu as choisi les " + couleur);
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