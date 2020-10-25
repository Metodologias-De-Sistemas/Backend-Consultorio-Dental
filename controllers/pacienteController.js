/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const { convertirEnMoment, calcularEdad } = require('../utils/utils');
const Paciente = require('../models/Paciente');
const MyError = require('../utils/MyError');

exports.getAll = async (_req, res, next) => {
  try {
    const pacientesDocs = await Paciente.find({})
      .select('-passwordHasheada')
      .populate('turnosProximos', { fecha: 1, horario: 1, estado: 1 });

    if (!pacientesDocs) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        msg: 'No hay pacientes para mostrar en la base de datos',
      });
    }

    res.send({
      success: true,
      successMsg: 'Listado de pacientes recuperados exitosamente.',
      data: pacientesDocs.map((pacienteDoc) => pacienteDoc.toJSON()),
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.createOne = async (req, res, next) => {
  try {
    const { body } = req;

    const rondas = 10;
    const passwordHasheada = await bcrypt.hash(body.password, rondas);

    const fechaNacimientoMoment = convertirEnMoment(body.fechaNacimiento);
    const edad = calcularEdad(fechaNacimientoMoment);

    const paciente = new Paciente({
      ...body,
      passwordHasheada,
      edad,
      fechaNacimiento: fechaNacimientoMoment.format('DD-MM-YYYY'),
    });

    const pacienteGuardado = await paciente.save();

    res.status(StatusCodes.CREATED).send({
      success: true,
      data: pacienteGuardado.toJSON(),
      successMessage: 'Paciente creado exitosamente en la base de datos.',
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const pacienteModificado = {
      ...body,
    };

    const pacienteActualizado = await Paciente.findByIdAndUpdate(
      id,
      pacienteModificado,
      { new: true },
    ).select('-passwordHasheada');

    if (!pacienteActualizado) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        msg: 'No se pudo actualizar el paciente, intente nuevamente',
        successMsg: '',
      });
    }

    return {
      success: true,
      data: pacienteActualizado,
      successMsg: 'Paciente actualizado exitosamente en la base de datos.',
    };
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pacienteEncontrado = await Paciente.findById(id).select(
      '-passwordHasheada',
    );

    if (!pacienteEncontrado) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        errorMsg: 'No se pudo encontrar ningun paciente con el id especificado',
      });
    }

    res.send({
      success: true,
      data: pacienteEncontrado.toJSON(),
      successMsg: `Paciente con el id: ${id} encontrado exitosamente.`,
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Paciente.findByIdAndDelete(id);

    res.status(StatusCodes.NO_CONTENT).send({
      success: true,
      successMsg: 'El documento fue borrado de la base de datos exitosamente. ',
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};
