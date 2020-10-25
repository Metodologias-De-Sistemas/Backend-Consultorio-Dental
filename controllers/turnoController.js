const { StatusCodes } = require('http-status-codes');
const Turno = require('../models/Turno');
const MyError = require('../utils/MyError');

exports.getAll = async (req, res, next) => {
  try {
    if (!req.token) {
      res.status(StatusCodes.UNAUTHORIZED).send({
        error: true,
        errorMessage: 'No tiene autorizacion para realizar la accion.',
      });
    }

    const turnosDocs = await Turno.find({});

    if (!turnosDocs) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        errorMessage: 'No hay turnos para mostrar en la base de datos.',
      });
    }

    res.send({
      success: true,
      successMessage: 'turnos obtenidos.',
      data: turnosDocs.map((turnoDoc) => turnoDoc.toJSON()),
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.createOne = async (req, res, next) => {
  try {
    if (!req.token) {
      res.status(StatusCodes.UNAUTHORIZED).send({
        error: true,
        errorMessage: 'No tiene autorizacion para realizar la accion.',
      });
    }

    const { body } = req;

    const turno = new Turno(body);

    const turnoGuardado = await turno.save();

    res.status(StatusCodes.CREATED).send({
      success: true,
      successMessage: 'turno creado',
      data: turnoGuardado.toJSON(),
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};
