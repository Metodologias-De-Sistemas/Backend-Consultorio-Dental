const MyError = require('../utils/MyError');

exports.getAll = (Model) => async (_req, res, next) => {
  try {
    const docs = await Model.find({});

    if (!docs) {
      res.status(404).send({
        error: 'No se pudo encontrar ningun documento asociado a la URL dada.',
      });
    }

    res.send(docs);
  } catch (err) {
    console.log(`error en el servidor:  ${err.message}`);
    next(
      new MyError(
        'Ocurrio un problema al intentar conseguir todos los registros de la entidad pedida ',
      ),
    );
  }
};

exports.getOne = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const docEncontrado = await Model.findById(id);

    if (!docEncontrado) {
      // undefined, null, '', 0, false

      res
        .status(404)
        .send({ error: 'No hay un paciente con el id especificado ' });
    }

    res.send(docEncontrado);
  } catch (err) {
    console.error(`error en getOne: ${err.message}`);
    next(
      new MyError('Ocurrio un problema al intentar buscar el registro pedido'),
    );
  }
};

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const { body } = req;

    const response = await Model.create({ ...body });

    res.status(201).send(response);
  } catch (err) {
    console.error(`error en createOne: ${err.message}`);
    next(
      new MyError(`Ocurrio un problema al intentar crear el registro pedido`),
    );
  }
};

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;

    await Model.findByIdAndDelete(id);

    res
      .status(204)
      .send({ msg: ' El documento pedido fue borrado exitosamente. ' });
  } catch (err) {
    console.error(`error en deleteOne: ${err.message}`);
    next(
      new MyError(`Ocurrio un problema al intentar borrar el registro pedido.`),
    );
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const documentoActualizado = await Model.findByIdAndUpdate(
      id,
      { ...body },
      { new: true },
    );

    res.status(200).send(documentoActualizado);
  } catch (err) {
    console.error(`error en updateOne ${err.message}`);
    next(
      new MyError(
        'OCurrio un problema al intentar modificar el registro pedido',
      ),
    );
  }
};
