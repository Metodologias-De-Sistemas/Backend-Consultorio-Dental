const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { endpointDesconocido } = require('./utils/middleware');
const pacienteRouter = require('./routers/pacienteRouter');
const loginRouter = require('./routers/loginRouter');
const { errorHandler, extraerToken } = require('./utils/middleware');

const app = express();

// Informacion / Opciones  / Configuracion
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(extraerToken);

// Endpoints
app.use('/api/pacientes', pacienteRouter);
app.use('/api/login', loginRouter);

// Fallback si hay un error
app.use(errorHandler);
app.use(endpointDesconocido);

module.exports = app;
