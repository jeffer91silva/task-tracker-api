module.exports = function errorHandler(err, req, res, _next) {
  console.error(err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
};
