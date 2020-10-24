const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const { convertirEnMoment, calcularEdad } = require('../utils/utils');
const Paciente = require('../models/Paciente');
const MyError = require('../utils/MyError');

exports.getAll = async (_req, res) => {
  try {
    const pacientesDocs = await Paciente.find({}).select('-passwordHasheada');

    if (!pacientesDocs) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: 'No hay pacientes para mostrar en la base de datos' });
    }

    res.send(pacientesDocs.map((pacienteDoc) => pacienteDoc.toJSON()));
  } catch (err) {
    throw new MyError('Error en getAll Pacientes');
  }
};

exports.createOne = async (req, res) => {
  try {
    const { body } = req;

    // hash de password

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

    res.status(StatusCodes.CREATED).send(pacienteGuardado.toJSON());
  } catch (err) {
    throw new MyError('Error en createOne paciente');
  }
};

exports.updateOne = async (req, res) => {
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
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: 'Ocurrio un error al actualizar el paciente' });
    }
  } catch (err) {
    throw new MyError('Error en updateOne paciente');
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const pacienteEncontrado = await Paciente.findById(id).select(
      '-passwordHasheada',
    );

    if (!pacienteEncontrado) {
      res.status(StatusCodes.NOT_FOUND).send({
        msg: 'No se pudo encontrar ningun paciente con el id especificado',
      });
    }

    res.send(pacienteEncontrado.toJSON());
  } catch (err) {
    throw new MyError('Error en getOne Paciente.');
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const { id } = req.params;

    await Paciente.findByIdAndDelete(id);

    res.status(StatusCodes.OK).send({
      msg: 'El documento fue borrado de la base de datos exitosamente. ',
    });
  } catch (err) {
    throw new MyError('Error en deleteOne controller');
  }
};
