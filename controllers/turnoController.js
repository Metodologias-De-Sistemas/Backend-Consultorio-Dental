const { StatusCodes } = require('http-status-codes');
const Turno = require('../models/Turno');
const MyError = require('../utils/MyError');

exports.getAll = async (_req, res, next) => {
  try {
    const turnosDocs = await Turno.find({});

    if (!turnosDocs) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        msg: 'No hay turnos para mostrar en la bases de datos',
      });
    }

    res.send({
      success: true,
      data: turnosDocs.map((turnoDoc) => turnoDoc.toJSON()),
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.createOne = async (req, res, next) => {
  try {
    const { body } = req;

    const turno = new Turno({
      ...body,
    });

    const turnoGuardado = await turno.save();

    res
      .status(StatusCodes.CREATED)
      .send({ success: true, data: turnoGuardado.toJSON() });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.updateOne = async (req, res, next) => {};

exports.getOne = async (req, res, next) => {};

exports.deleteOne = async (req, res, next) => {};
