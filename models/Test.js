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

testSchema.set('toJSON', {
  transform: (document, returnedTest) => {
    returnedTest.id = returnedTest._id.toString();

    delete returnedTest._id;
    delete returnedTest.__v;
  },
});

module.exports = mongoose.model('Test', testSchema);
