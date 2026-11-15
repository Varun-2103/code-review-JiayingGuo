// Creates an Error that errorHandler turns into { error: message } with this
// status code.
export default function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
