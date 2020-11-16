const { StatusCodes } = require('http-status-codes');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const logger = require('../utils/logger');
const { decodearToken } = require('../utils/common');
const MyError = require('../utils/MyError');
const { recibo, htmlToBytes } = require('../utils/utils');

exports.pagarTurno = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    if (!tokenDecodeado) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const { email, nombreCompleto } = tokenDecodeado;
    const { numTarjeta, prestacion, totalAPagar } = req.body;
    const reciboHTML = recibo(
      numTarjeta,
      nombreCompleto,
      email,
      prestacion,
      totalAPagar,
    );

    const result = await htmlToBytes(reciboHTML, nombreCompleto);

    res.set('Content-Type', 'application/pdf');
    res.send(result);
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};
