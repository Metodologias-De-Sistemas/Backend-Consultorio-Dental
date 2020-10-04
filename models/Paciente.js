const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  DNI: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 9,
    unique: true,
  },
  edad: {
    type: Number,
    min: 0,
    max: 100,
  },
  fechaNacimiento: {
    type: Date,
    required: true,
  },
  numeroTelefono: {
    type: String,
    minlength: 8,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    minlength: 10,
  },
  obraSocial: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Paciente', pacienteSchema);
