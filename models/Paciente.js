const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const pacienteSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  nombreDeUsuario: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHasheada: {
    type: String,
    required: true,
    minlength: 8,
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

pacienteSchema.set('toJSON', {
  transform: (document, returnedPaciente) => {
    returnedPaciente.id = returnedPaciente._id.toString();

    delete returnedPaciente._id;
    delete returnedPaciente.__v;
  },
});

module.exports = mongoose.model('Paciente', pacienteSchema);
