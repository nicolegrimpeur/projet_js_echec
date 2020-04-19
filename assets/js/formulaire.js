// Connexion à un socket
var socket = io.connect('http://localhost:8100');

// demande le psuedo et l'envoie au server
var pseudo = prompt('Quel est votre pseudo ?');
socket.emit('nouveau_client', pseudo);
document.title = pseudo + ' - ' + document.title;


// insertion dans la page de jeu
socket.on('push_message',function(msg,pseudo) {

        console.log("push_message", msg, pseudo)
        insereMessage(pseudo+":", msg);


})

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaire_chat').submit(function () {
    var message = $('#message').val();
    socket.emit('message', message,pseudo); // visible pour tous
    insereMessage(pseudo+":", message); // Affiche le message aussi sur notre page
    $('#message').val('').focus(); // Vide l'espace d'écriture
    return false; // pour bloquer une nouvelle demande du pseudo
});

// l'ajout d'un message
function insereMessage(pseudo, message) {


    $('#zone_chat').prepend('<p><strong>' + pseudo + '</strong> ' + message + '</p>');
}