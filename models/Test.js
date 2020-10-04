const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const testSchema = new mongoose.Schema({
  nombre: {
    type: String,
  },
  apellido: {
    type: String,
  },
});

module.exports = mongoose.model('Test', testSchema);
