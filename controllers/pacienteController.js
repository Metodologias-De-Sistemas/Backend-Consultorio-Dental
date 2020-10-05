const Paciente = require('../models/Paciente');
const MyError = require('../utils/MyError');
const moment = require('moment-business-days');
const bcrypt = require('bcrypt');

exports.getAll = async (_req, res, next) => {
  try {
    const pacientesDocs = await Paciente.find({}).select('-passwordHasheada');

    if (!pacientesDocs) {
      res
        .status(404)
        .send({ error: 'No hay pacientes para mostrar en la base de datos' });
    }

    res.send(pacientesDocs.map((pacienteDoc) => pacienteDoc.toJSON()));
  } catch (err) {
    console.error(
      'Error al intentar buscar todos los pacientes en la base de datos.',
    );
    next(new MyError('Error en getAll Pacientes'));
  }
};

exports.createOne = async (req, res, next) => {
  try {
    const { body } = req;

    // hash de password

    const rondas = 10;
    const passwordHasheada = await bcrypt.hash(body.password, rondas);

    // Sacar edad en base a fecha nacimiento

    const esteAño = moment().year();
    const momentNacimiento = moment(body.fechaNacimiento);
    const añoNacimiento = momentNacimiento.year();
    const edad = esteAño - añoNacimiento;

    const paciente = new Paciente({
      ...body,
      passwordHasheada,
      edad,
    });

    const pacienteGuardado = await paciente.save();

    const pacienteGuardadoJSON = pacienteGuardado.toJSON();

    // Deleteamos la password porque no hace falta devovlersela a la pagina.

    delete pacienteGuardadoJSON.passwordHasheada;

    res.send(pacienteGuardadoJSON);
  } catch (err) {
    console.error(`Error al crear un nuevo paciente: ${err.message}`);
    next(new MyError('Error en createOne paciente'));
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
      res
        .status(404)
        .send({ msg: 'Ocurrio un error al actualizar el paciente' });
    }
  } catch (err) {
    console.error(`Error in updateOne paciente: ${err.message}`);
    next(new MyError('Error en updateOne paciente'));
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pacienteEncontrado = await Paciente.findById(id).select('-passwordHasheada');

    if (!pacienteEncontrado) {
      res.status(404).send({
        msg: 'No se pudo encontrar ningun paciente con el id especificado',
      });
    }

    res.send(pacienteEncontrado.toJSON());
  } catch (err) {
    console.error(
      `Hubo un error al buscar el paciente especificado: ${err.message} `,
    );
    next(new MyError('Error en getOne Paciente.'));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Paciente.findByIdAndDelete(id);

    res.status(200).send({
      msg: 'EL documento fue borrado de la base de datos exitosamente. ',
    });
  } catch (err) {
    console.error(
      `Error al intentar borrar un paciente en la base de datos: ${err.message}`,
    );
    next(new MyError('Error en deleteOne Paciante'));
  }
};
