var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');

var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');

function renderizarUsuarios(personas) {
	console.log(personas);

	var html = '';
	html += '<li>';
	html += '<a href="javascript:void(0)" class="active">Chat de <span> ' + params.get('sala') + '</span></a>';
	html += '</li>';

	for (var i = 0; i < personas.length; i++) {
		html += '<li>';
		html += '<a data-d=' + personas[i].id + ' href="javascript:void(0)">';
		html += '<img src="assets/images/users/3.jpg" alt="user-img" class="img-circle" />';
		html += '<span>';
		html += personas[i].nombre + '<small class="text-success">online</small>';
		html += '</span>';
		html += '</a>';
		html += '</li>';
	}

	divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {
	var html = '';
	var fecha = new Date(mensaje.fecha);
	var hora = fecha.getHours() + ':' + fecha.getMinutes();

	var adminClass = 'info';

	if (mensaje.nombre === 'Admin') {
		adminClass = 'danger';
	}

	if (yo) {
		html += '<li class="reverse">';
		html += ' <div class="chat-content"><h5>' + mensaje.nombre + '</h5>';
		html += '		<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
		html += '	</div>';
		html += '	<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
		html += '	<div class="chat-time">' + hora + '</div>';
		html += '</li>';
	} else {
		html += '<li class="animated fadeIn">';
		if (mensaje.nombre !== 'Admin') {
			html += '	<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
		}
		html += '	<div class="chat-content"><h5>' + mensaje.nombre + '</h5><div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div></div>';
		html += '	<div class="chat-time">' + hora + '</div>';
		html += '</li>';
	}

	divChatbox.append(html);
}

function scrollBottom() {
	// selectors
	var newMessage = divChatbox.children('li:last-child');

	// heights
	var clientHeight = divChatbox.prop('clientHeight');
	var scrollTop = divChatbox.prop('scrollTop');
	var scrollHeight = divChatbox.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight() || 0;

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		divChatbox.scrollTop(scrollHeight);
	}
}

// Listeners

divUsuarios.on('click', 'a', function () {
	var id = $(this).data('id');
	if (id) {
		console.log('Hola');
	}
});

formEnviar.on('submit', function (e) {
	e.preventDefault();
	if (txtMessage.val().trim().length === 0) {
		return;
	}

	// Enviar información
	socket.emit(
		'crearMensaje',
		{
			nombre: nombre,
			mensaje: txtMessage.val(),
		},
		function (mensaje) {
			txtMessage.val('').focus();
			renderizarMensajes(mensaje, true);
			scrollBottom();
		}
	);
});
