const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const decodearToken = (token) => {
  if (!token) {
    return undefined;
  }

  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  PRESTACIONES: [
    'RELEVAMIENTO BUCAL',
    'RESTAURACION DE PIEZAS DENTALES',
    'TRATAMIENTO DE CARIES',
    'ENDODONCIA',
    'EXTRACCION DE PIZAS DENTALES',
    'LIMPIEZA BUCAL',
    'RETRACCION GINGIVAL',
    'BLANQUEAMIENTO BUCAL',
    'CARILLAS DE CERAMICA',
    'CARILLAS DE PORCELANA',
    'CARILLAS DE CEROMEROS',
    'IMPLANTES',
    'ORTODONCIA ESTETICA',
  ],
  decodearToken,
};
