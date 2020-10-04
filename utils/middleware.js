const endpointDesconocido = (_req, res, _next) => {
  res.send(404).send({ error: 'Endpoint desconocido '})
};

module.exports = {
  endpointDesconocido
};