var http = require('http');
var express = require('express');
var ent = require("ent"); //Transforme en texte les entité HTML

//On exécute le constructeur
var app = express();

//On créé notre serveur
var server = http.createServer(app);
app.use(express.static( __dirname + "/public"));
app.get('/', function(req, res) {
	res.sendFile( __dirname + '/public/index.html');
});

//Les traitements synchrone vont pouvoir être réalisé grâce à socketio et les WebSockets
var socketio = require('socket.io').listen(server);

socketio.sockets.on('connection', function(socket){
	
	//On vérifie que tout fonction bien
	console.log("Un utilisateur est connecté !");


	//Ecoute de l'évènelent comportant de pseudo que le socket émer/rend observable
	socket.on('pseudo', function(pseudo) {

		//On stock le pseudo dans la propriété pseudo de notre objet socket 
		socket.pseudo = ent.encode(pseudo);

		//On indique à tout les utilisateur qu'un socket/utilisateur vient de se connecter
		socket.broadcast.emit("userConnected", pseudo);
	});

	//Ecoute de l'évènelent comportant le message saisie
	socket.on('message', function(message, pseudo){
		//On encode le message et le pseudo
		var message = ent.encode(message), pseudo = ent.encode(pseudo);

		socket.broadcast.emit("messageUtilisateur", message, pseudo);
	});
});

server.listen(8080);