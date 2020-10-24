const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../utils/config');
const { StatusCodes } = require('http-status-codes');
const Paciente = require('../models/Paciente');
const MyError = require('../utils/MyError');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { nombredeusuario, passwordHasheada } = req.body;
    const usuarioEncontrado = await Paciente.findOne({
      nombreDeUsuario: nombredeusuario,
    });

    if (!usuarioEncontrado) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: 'Usuario o contraseña incorrectos' });
    }

    if (!bcrypt.compareSync(passwordHasheada, usuarioEncontrado.passwordHasheada)) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ msg: 'Usuario o contraseña incorrectos' });
    }

    let token = jwt.sign({usuario: usuarioEncontrado.toJSON()}, JWT_SECRET);
    res.status(StatusCodes.OK).json({ok: true,
              usuario: usuarioEncontrado.toJSON(),
              token,});
  } catch (err) {
    console.log(err)
    throw new MyError(`Error en login.`);
  }
};
