const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utils');

const usuarios = new Usuarios();

io.on('connection', (client) => {
	client.on('entrarChat', (data, callback) => {
		if (!data.nombre || !data.sala) {
			return callback({
				err: true,
				mensaje: 'El nombre y la sala son necesarios',
			});
		}

		client.join(data.sala);

		let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

		client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
		client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Admin', `${data.nombre} se unió`));

		callback(personas);
	});

	client.on('crearMensaje', (data, callback) => {
		let persona = usuarios.getPersona(client.id);
		let mensaje = crearMensaje(persona.nombre, data.mensaje);
		client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

		callback(mensaje);
	});

	client.on('disconnect', () => {
		let personaBorrada = usuarios.borrarPersona(client.id);

		if (personaBorrada) {
			client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Admin', `${personaBorrada.nombre} salió del chat`));
			client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
		}
	});

	client.on('mensajePrivado', (data) => {
		let persona = usuarios.getPersona(client.id);

		client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
	});
});
