class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
  }
}

export const createError = (status, message) => {
  const error = new HttpError(message, status);
  return error;
};
