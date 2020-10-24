const moment = require('moment-business-days');

exports.convertirEnMoment = (fecha) => {
  return moment(fecha);
};

exports.calcularEdad = (fechaDeNacimiento) => {
  const edad = fechaDeNacimiento.year();
  const esteAño = moment().year();

  return esteAño - edad;
};
