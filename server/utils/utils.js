const crearMensaje = (nombre, mensaje) => {
	return {
		fecha: new Date().getTime(),
		nombre,
		mensaje,
	};
};

module.exports = {
	crearMensaje,
};
