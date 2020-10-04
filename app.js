const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { endpointDesconocido } = require('./utils/middleware');

const app = express();

// Informacion / Opciones  / Configuracion
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));


// Endpoints
app.use(endpointDesconocido);

module.exports = app;