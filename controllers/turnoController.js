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
      successMessage: 'Listado de turnos recuperados exitosamente.',
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

exports.updateOne = async (req, res, next) => {
  try {
    if (!req.token) {
      res.status(StatusCodes.UNAUTHORIZED).send({
        error: true,
        errorMessage: 'No tiene autorizacion para realizar la accion.',
      });
    }

    const { id } = req.params;
    const { body } = req;

    const turnoModificado = {
      ...body,
    };

    const turnoActualizado = await Turno.findByIdAndUpdate(
      id,
      turnoModificado,
      { new: true },
    );

    if (!turnoActualizado) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        errorMessage: 'No se pudo actualizar el turno, intente nuevamente',
      });
    }

    return {
      success: true,
      data: turnoActualizado,
      successMessage: 'Turno actualizado exitosamente en la base de datos',
    };
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.getAllById = async (req, res, next) => {
  try {
    if (!req.token) {
      res.status(StatusCodes.UNAUTHORIZED).send({
        error: true,
        errorMessage: 'No tiene autorizacion para realizar la accion.',
      });
    }

    const { id } = req.params;

    const turnosEncontrados = await Turno.find({ paciente: id });

    if (!turnosEncontrados) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        errorMessage: 'No se encontro ningun turno para el pasiente',
      });
    }

    res.send({
      success: true,
      successMessage:
        'Listado de turnos para el paciente recuperados exitosamente',
      data: turnosEncontrados.map((turnoDoc) => turnoDoc.toJSON()),
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }

  exports.deleteOne = async (req, res, next) => {
    try {
      if (!req.token) {
        res.status(StatusCodes.UNAUTHORIZED).send({
          error: true,
          errorMessage: 'No tiene autorizacion para realizar la accion.',
        });
      }

      const { id } = req.params;

      await Turno.findByIdAndDelete(id);

      res.status(StatusCodes.NO_CONTENT).send({
        success: true,
        successMessage: 'El turno fue borrado de la base de datos exitosamente',
      });
    } catch (err) {
      next(new MyError(500, `${err.message}`));
    }
  };
};
