const endpointDesconocido = (_req, res) => {
  res.status(404).send({ error: 'Endpoint desconocido ' });
};

module.exports = {
  endpointDesconocido,
};
