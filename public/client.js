/**
	* Fichier qui permet de gérer 
	*
	*/
	var socket = io.connect("http://localhost:8080");

	//Pseudo de l'utilisateur
	var pseudo = prompt("Quel est votre pseudo ?"), proceed = true;

	while(proceed) {
		pseudo != null ? proceed = false : proceed = true;

		if(proceed) {
			var pseudo = prompt("Quel est votre pseudo ?");
		}
	}

	//Emition d'un évènmeent dont le but est d'être observable
	socket.emit("pseudo", pseudo);

	var form = document.getElementById("my-form");

	//On écoute l'évènement submit envoyé par notre formulaure lorsque l'on clique sur le bouton
	form.addEventListener("submit", function(e){

		//On récupère le l'éménet qui contient les messages
		var divMessages = document.getElementById("messages");

		var message = e.target.message_user.value;

		//Message à afficher protéger puisqu'il va s'agir d'un noeud textuel
		var messageAfficher = document.createTextNode(pseudo + " : " + message); 


		//On affiche le message et le pseudo
		divMessages.appendChild(messageAfficher);
		divMessages.innerHTML +=  "<br/>";

		//On émet un évènement en passant le pseudo et le message 
		socket.emit("message", message, pseudo);

		//On vide le formulaire
		form.reset();

		//On stoppe l'action ici (tel un return false; )
		e.preventDefault();

	}, true);

	//on va écouter le message de l'utilisateur afin de l'afficher comme il se doit
	socket.on("messageUtilisateur", function(message, pseudoMessage) {
		var divMessages = document.getElementById("messages");

		messageAfficher = pseudoMessage + " : " + message;

		divMessages.innerHTML += messageAfficher + "<br/>";

	});

	//On écoute l'évènement qui broadcast lorsque quelqu'un se connect
	socket.on('userConnected', function(pseudoConnected){
		var divMessages = document.getElementById("messages");

		divMessages.innerHTML += pseudoConnected + " viens de rejoindre le chat ! <br/>";

	})
