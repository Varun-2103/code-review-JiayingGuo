// Express needs all four parameters to treat this as an error handler.
export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
  res.status(status).json({ error: err.message });
}
