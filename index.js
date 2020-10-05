const app = require('./app');
const { PORT, MONGODB_URI } = require('./utils/config');
const mongoose = require('mongoose');

console.log(`Connectandoe a la base de datos.`);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then((_res) => {
  console.log("Conexion a la base de datos exitosa.");
})
.catch((err) => {
  console.error(`Conexion fallida. ${err.message}`);
});


app.listen(PORT, () => {
  console.log(`Servidor viglando el puerto: ${PORT}`);
})