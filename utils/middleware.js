const endpointDesconocido = (_req, res, _next) => {
  res.status(404).send({ error: 'Endpoint desconocido ' });
};

module.exports = {
  endpointDesconocido,
};
