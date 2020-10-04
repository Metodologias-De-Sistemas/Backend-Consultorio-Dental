class MyError extends Error {
  constructor(status, message) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message || 'Ocurrio algo malo en el servidor.';

    this.status = status || 500;
  }
}

module.exports = MyError;
