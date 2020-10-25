const mongoose = require('mongoose');
const app = require('./app');
const logger = require('./utils/logger');
const { PORT, MONGODB_URI, NODE_ENV } = require('./utils/config');

logger.info(`Connectandose a la base de datos.`);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info(
      `Conexion a la base de datos exitosa, environment: ${NODE_ENV}`,
    );
  })
  .catch((err) => {
    logger.error(`Conexion fallida. ${err.message}`);
  });

app.listen(PORT, () => {
  logger.info(`Servidor viglando el puerto: ${PORT}`);
});
