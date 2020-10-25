const { StatusCodes } = require('http-status-codes');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const { decodearToken } = require('../utils/common');
const MyError = require('../utils/MyError');

exports.getAll = async (req, res, next) => {
  try {
    const turnos = await Turno.find({}).populate('paciente', {
      nombreCompleto: 1,
      DNI: 1,
      edad: 1,
      numeroTelefono: 1,
      email: 1,
      obraSocial: 1,
    });

    res.status(StatusCodes.OK).send({
      success: true,
      data: turnos,
      successMessage: 'Mostrando todos los turnos en la base de datos.',
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.createOne = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);

    if (!tokenDecodeado) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const { prestacion, fecha, observacion, horario } = req.body;

    const turnosCoincidentes = await Turno.find({ fecha, horario });

    if (turnosCoincidentes.length) {
      throw new MyError(400, 'Ya existe un turno para ese dia y horario.');
    }

    const { id: pacienteId } = tokenDecodeado;
    const paciente = await Paciente.findById(pacienteId);

    const turno = new Turno({
      prestacion,
      fecha,
      observacion,
      horario,
      paciente: pacienteId,
    });

    let turnoGuardado = await turno.save();

    turnoGuardado = turnoGuardado.toJSON();

    await paciente.turnosProximos.push(turnoGuardado.id);
    await paciente.save();

    res.status(StatusCodes.CREATED).send({
      success: true,
      successMessage: 'Turno creado exitosamente.',
      data: turnoGuardado,
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.updateOne = async (req, res, next) => {};

exports.deleteOne = async (req, res, next) => {};

exports.getOne = async (req, res, next) => {};
