/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const prestacionesEnums = [];
const horarioEnum = ['mañana', 'tarde'];

const turnoSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Paciente',
    required: true,
  },
  prestacion: {
    type: String,
    enum: prestacionesEnums,
    required: true,
  },
  fecha: {
    type: String,
    required: true,
  },
  observacion: {
    type: String,
    maxlength: 500,
  },
  horario: {
    type: String,
    required: true,
    enum: horarioEnum,
  },
});

turnoSchema.set('toJSON', {
  transform: (document, returnedTurno) => {
    returnedTurno.id = returnedTurno._id.toString();

    delete returnedTurno._id;
    delete returnedTurno.__v;
  },
});
