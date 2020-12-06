const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');
const logger = require('../utils/logger');
const { decodearToken } = require('../utils/common');
const { mailSender, getMailOptions } = require('../utils/emailSender');
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

    const { fecha, observacion, horario } = req.body;

    let turnosCoincidentes;
    if (horario < 12) {
      // turno maniana
      turnosCoincidentes = await Turno.find({
        fecha,
        horario: {
          $gte: 8,
          $lte: 11,
        },
      });
    } else {
      turnosCoincidentes = await Turno.find({
        fecha,
        horario: {
          $gte: 16,
          $lte: 19,
        },
      });
    }

    if (turnosCoincidentes.length) {
      throw new MyError(400, 'Ya existe un turno para ese dia y horario.');
    }

    const { id: pacienteId } = tokenDecodeado;
    const paciente = await Paciente.findById(pacienteId);

    if (!paciente) {
      throw new MyError(500, 'No hay paciente con el ID determinado.');
    }

    const turno = new Turno({
      fecha,
      observacion,
      horario,
      paciente: pacienteId,
    });

    let turnoGuardado = await turno.save();

    turnoGuardado = turnoGuardado.toJSON();

    await paciente.turnosProximos.push(turnoGuardado.id);
    await paciente.save();

    const htmlPath = path.join(
      __dirname,
      '../utils/HTML_templates/turnoCreado.html',
    );

    const htmlTurnoCreado = await fs.promises.readFile(htmlPath, 'utf-8');

    const mailOpts = getMailOptions({
      to: `${paciente.email}`,
      subject: 'Consultorio Dental Sonrisa Feliz - Confirmacion Turno Creado',
      html: htmlTurnoCreado,
    });

    await mailSender.sendMail(mailOpts);
    logger.info('Email enviado.');

    res.status(StatusCodes.CREATED).send({
      success: true,
      successMessage: 'Turno creado exitosamente.',
      data: turnoGuardado,
    });
  } catch (err) {
    logger.error('Email para creacion del turno no fue enviado.');
    next(new MyError(500, `${err.message}`));
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    const usuario = await Paciente.findById(tokenDecodeado.id);

    if (!tokenDecodeado || usuario.rol !== 1) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const { id } = req.params;

    if (!id) {
      throw new MyError(
        404,
        'No se puede encontrar ningun turno con el ID dado.',
      );
    }

    const { body } = req;

    const turnoModificado = {
      ...body,
    };

    const turnoActualizado = await Turno.findByIdAndUpdate(
      id,
      turnoModificado,
      {
        new: true,
      },
    ).populate('paciente', {
      email: 1,
    });

    if (!turnoActualizado) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: true,
        errorMessage: 'No se pudo actualizar el turno, intente nuevamente',
      });
    }

    const { email: pacienteEmail } = turnoActualizado.paciente;

    const htmlPath = path.join(
      __dirname,
      '../utils/HTML_templates/turnoModificado.html',
    );

    const htmlTurnoModificado = await fs.promises.readFile(htmlPath, 'utf-8');

    const mailOpts = getMailOptions({
      to: `${pacienteEmail}`,
      subject:
        'Consultorio Dental Sonrisa Feliz - Confirmacion Turno Modificado',
      html: htmlTurnoModificado,
    });

    await mailSender.sendMail(mailOpts);
    logger.info('Email enviado.');

    return res.send({
      success: true,
      data: turnoActualizado,
      successMessage: 'Turno actualizado exitosamente en la base de datos',
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    const usuario = await Paciente.findById(tokenDecodeado.id);

    if (!tokenDecodeado || usuario.rol !== 1) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const { id } = req.params;

    if (!id) {
      throw new MyError(
        404,
        'No se puede encontrar ningun turno con el ID dado.',
      );
    }

    const turnoBorrado = await Turno.findByIdAndDelete(id).populate(
      'paciente',
      { email: 1 },
    );

    if (!turnoBorrado) {
      res.send({
        success: true,
        successMessage: 'Turno no se encuentra en la base de datos.',
      });
    }

    const { email: emailPaciente } = turnoBorrado.paciente;
    const htmlPath = path.join(
      __dirname,
      '../utils/HTML_templates/turnoEliminado.html',
    );

    const htmlTurnoBorrado = await fs.promises.readFile(htmlPath, 'utf-8');
    const mailOpts = getMailOptions({
      to: `${emailPaciente}`,
      subject:
        'Consultorio Dental Sonrisa Feliz - Eliminacion de Turno Solicitado.',
      html: htmlTurnoBorrado,
    });

    await mailSender.sendMail(mailOpts);
    logger.info('Email enviado.');

    return res.send({
      success: true,
      successMessage: 'Turno borrado exitosamente de la base de datos.',
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

// gaston estuvo aqui

exports.getOne = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    const usuario = await Paciente.findById(tokenDecodeado.id);
    if (!tokenDecodeado || usuario.rol !== 1) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const { id } = req.params;
    if (!id) {
      throw new MyError(404, 'No se pudo encotar turno con el ID dado.');
    }

    const turnoEncorntrador = await Turno.findById(id).populate('paciente', {
      nombreCompleto: 1,
      DNI: 1,
      edad: 1,
      numeroTelefono: 1,
      email: 1,
      obraSocial: 1,
    });

    if (!turnoEncorntrador) {
      res.status(StatusCodes.NOT_FOUND).send({
        error: true,
        errorMessage: 'No se puedo encontrar un turno con el ID especificado.',
      });
    }

    res.send({
      success: true,
      data: turnoEncorntrador.toJSON(),
      successMessage: `Paciente con el id: ${id} encontrado exitosamente.`,
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.getTurnosAceptados = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    const usuario = await Paciente.findById(tokenDecodeado.id);

    if (!tokenDecodeado || usuario.rol !== 1) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const turnosAceptados = await Turno.find({ estado: 'ACEPTADO' }).populate(
      'paciente',
      {
        nombreCompleto: 1,
        DNI: 1,
        edad: 1,
        numeroTelefono: 1,
        email: 1,
        obraSocial: 1,
      },
    );

    if (!turnosAceptados) {
      res.send({
        error: true,
        errorMessage: 'No hay turnos aceptados para mostrar.',
      });
    }
    res.send({
      success: true,
      data: turnosAceptados,
      successMessage: 'Turnos aceptados, obtenidos exitosamente',
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};

exports.getFechasOcupadas = async (req, res, next) => {
  try {
    const tokenDecodeado = decodearToken(req.token);
    const usuario = await Paciente.findById(tokenDecodeado.id);

    if (!tokenDecodeado || usuario.rol !== 1) {
      throw new MyError(403, 'Credenciales erroneas, error con JWT.');
    }

    const turnosPedidos = await Turno.find({});
    const diasOcupados = turnosPedidos.map((turno) => {
      return {
        fecha: turno.fecha,
        horario: turno.horario,
      };
    });

    const mapDeFechas = new Map();

    // inicializo el mapa con keys de tipo string o fecha, y valores en 0, sirve
    // como contador para la proxima operacion.
    diasOcupados.forEach(({ fecha }) => mapDeFechas.set(fecha, 0));

    diasOcupados.forEach(({ fecha }) =>
      mapDeFechas.set(fecha, mapDeFechas.get(fecha) + 1),
    );

    const arrFechasOcupadas = [];

    mapDeFechas.forEach((value, key) => {
      if (value >= 2) {
        arrFechasOcupadas.push(key);
      }
    });

    return res.send({
      data: arrFechasOcupadas,
      msg: 'Recuperando fechas ocupadas.',
      success: true,
    });
  } catch (err) {
    next(new MyError(500, `${err.message}`));
  }
};
