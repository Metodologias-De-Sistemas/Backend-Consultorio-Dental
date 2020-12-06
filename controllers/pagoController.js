const { StatusCodes } = require('http-status-codes');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const logger = require('../utils/logger');
const { decodearToken } = require('../utils/common');
const MyError = require('../utils/MyError');
const { mailSender, getMailOptions } = require('../utils/emailSender');
const { recibo, htmlToBytes } = require('../utils/utils');

exports.pagarTurno = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    if (!tokenDecodeado) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const { email, nombreCompleto } = tokenDecodeado;
    const { numTarjeta, prestacion, totalAPagar, turnoId } = req.body;

    const turnoEncontrado = await Turno.findById(turnoId);

    if (!turnoEncontrado) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        errorMessage:
          'No se puedo encontrar un turno con el ID especificado, no se puede pagar.',
      });
    }

    turnoEncontrado.pago = 'PAGADO';
    turnoEncontrado.save();

    const reciboHTML = recibo(
      numTarjeta,
      nombreCompleto,
      email,
      prestacion,
      totalAPagar,
    );

    //const result = await htmlToBytes(reciboHTML, nombreCompleto);

    //res.set('Content-Type', 'application/pdf');
    //res.send(result);

    const mailOpts = getMailOptions({
      to: `${email}`,
      subject: 'Consultorio Dental Sonrisa Feliz - Comprobante de pago.',
      html: reciboHTML,
    });

    await mailSender.sendMail(mailOpts);
    logger.info('Email enviado.');

    res.status(StatusCodes.CREATED).send({
      success: true,
      successMessage: 'Pago realizado correctamente.',
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};
