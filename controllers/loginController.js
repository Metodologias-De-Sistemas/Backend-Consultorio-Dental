const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');
const Paciente = require('../models/Paciente');
const MyError = require('../utils/MyError');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { nombredeusuario, passwordHasheada } = req.body;
    const usuarioEncontrado = Paciente.findOne({
      nombreDeUsuario: nombredeusuario,
    });

    if (!usuarioEncontrado) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: 'Usuario o contraseña incorrectos' });
    }

    if (
      !bcrypt.compareSync(passwordHasheada, usuarioEncontrado.passwordHasheada)
    ) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: 'Usuario o contraseña incorrectos' });
    }

    let token = jwt.sign();
  } catch (err) {
    throw new MyError('Error en login');
  }
};
