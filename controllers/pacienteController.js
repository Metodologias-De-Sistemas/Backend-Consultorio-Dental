const Paciente = require('../models/Paciente');
const MyError = require('../utils/MyError');
const moment = require('moment-business-days');
const bcrypt = require('bcrypt');

exports.getAll = async (_req, res, next) => {
  try {
    const pacientesDocs = await Paciente.find({});

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

    /* 
  paciente: {
    nombreCompleto: Gaston Ferreyra
    fechaNacimiento: 24/08/1995,
    DNI: 37 444 444,
    nombreDeUsuario: tongas,
    password: 12345678,
    numDeTelefono: 549362444444,
    email: tongas@gmail.com,
    obraSocial: OSDE,
  }

  edad: derivado
  **/

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
      password: passwordHasheada,
      edad,
    });

    const pacienteGuardado = await paciente.save();

    res.send(pacienteGuardado.toJSON());
  } catch (err) {
    console.error(`Error al crear un nuevo paciente: ${err.message}`);
    next(new MyError('Error en createOne paciente'));
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pacienteEncontrado = await Paciente.findById(id);

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
