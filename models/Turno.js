/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const { PRESTACIONES } = require('../utils/common');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const estadoEnum = ['PENDIENTE', 'ACEPTADO'];

const turnoSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Paciente',
    required: true,
  },
  prestacion: {
    type: String,
    enum: PRESTACIONES,
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
    type: Number,
    required: true,
  },
  estado: {
    type: String,
    required: true,
    enum: estadoEnum,
    default: 'PENDIENTE',
  },
  pago: {
    type: String,
    default: 'NO PAGADO',
  },
});

mongoose.set('toJSON', {
  transform: (document, returnedTurno) => {
    returnedTurno.id = returnedTurno._id.toString();

    delete returnedTurno._id;
    delete returnedTurno.__v;
  },
});

module.exports = mongoose.model('Turno', turnoSchema);
