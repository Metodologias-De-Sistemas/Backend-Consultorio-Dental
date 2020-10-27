const { StatusCodes } = require('http-status-codes');
const Consulta = require('../models/Consulta');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const { decodearToken } = require('../utils/common');
const MyError = require('../utils/MyError');

exports.getAll = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    const usuario = await Paciente.findById(tokenDecodeado.id);

    if (!tokenDecodeado || usuario.rol !== 1) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const consultasDocs = await Consulta.find({}).populate('paciente', {
      nombreCompleto: 1,
      DNI: 1,
      edad: 1,
      numeroTelefono: 1,
      email: 1,
      obraSocial: 1,
    });

    res.send({
      success: true,
      successMessage: 'Listado de consultas recuperado exitosamente',
      data: consultasDocs.map((consultaDoc) => consultaDoc.toJSON()),
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.createOne = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    const usuario = await Paciente.findById(tokenDecodeado.id);

    if (!tokenDecodeado || usuario.rol !== 1) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const { turnoId, observacion: nuevaObservacion } = req.body;
    const turnoEncontrado = await Turno.findByIdAndDelete(turnoId);
    if (!turnoEncontrado) {
      throw new MyError(
        404,
        'No existe un turno con esa ID en la base de datos',
      );
    }

    const consulta = new Consulta({
      paciente: turnoEncontrado.paciente,
      prestacion: turnoEncontrado.prestacion,
      fecha: turnoEncontrado.fecha,
      observacion: nuevaObservacion,
    });

    let consultaGuardada = await consulta.save();
    consultaGuardada = consultaGuardada.toJSON();

    const paciente = await Paciente.findById(turnoEncontrado.paciente);
    await paciente.historiaClinica.push(consultaGuardada.id);
    await paciente.save();

    res.status(StatusCodes.CREATED).send({
      success: true,
      successMessage:
        'Consulta agregada a la historia clinica del paciente exitosamente en la base de datos',
      data: consultaGuardada,
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    const usuario = await Paciente.findById(tokenDecodeado.id);

    if (!tokenDecodeado || usuario.rol !== 1) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const { id } = req.params;
    const consultaEncontrada = await Consulta.findById(id);

    if (!consultaEncontrada) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        errorMessage: 'No existe una consulta con esa ID en la base de datos',
      });
    }

    res.send({
      success: true,
      successMessage: `Consulta con id: ${id} encontrado exitosamente`,
      data: consultaEncontrada.toJSON(),
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};
