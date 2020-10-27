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
    delete usuarioJSON.historiaClinica;
    delete usuarioJSON.turnosProximos;
    const rolUsuario = usuarioJSON.rol;
    delete usuarioJSON.rol;

    const token = jwt.sign(usuarioJSON, JWT_SECRET);
    res.status(StatusCodes.OK).json({
      success: true,
      successMessage: 'Se realizo el login correctamente.',
      id: usuarioJSON.id,
      email: usuarioJSON.email,
      paciente: {
        rol: rolUsuario,
        nombreCompleto: usuarioJSON.nombreCompleto,
        fechaNacimiento: usuarioJSON.fechaNacimiento,
        DNI: usuarioJSON.DNI,
        obraSocial: usuarioJSON.obraSocial,
        edad: usuarioJSON.edad,
      },
      token,
    });
  } catch (err) {
    next(new MyError(500, `Error en loginController: ${err.message}`));
  }
};
