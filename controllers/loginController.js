const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { JWT_SECRET } = require('../utils/config');
const Paciente = require('../models/Paciente');
const MyError = require('../utils/MyError');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const usuarioEncontrado = await Paciente.findOne({
      email,
    });

    const esLoginValido = await bcrypt.compare(
      password,
      usuarioEncontrado.passwordHasheada,
    );

    if (!usuarioEncontrado || !esLoginValido) {
      throw new MyError(400, 'Usuario o contraseña incorrectos');
    }

    const usuarioJSON = usuarioEncontrado.toJSON();

    const token = jwt.sign(
      { usuario: usuarioJSON.email, id: usuarioJSON.id },
      JWT_SECRET,
    );
    res.status(StatusCodes.OK).json({
      success: true,
      nombreCompleto: usuarioJSON.nombreCompleto,
      token,
    });
  } catch (err) {
    next(new MyError(500, `Error en loginController: ${err.message}`));
  }
};
