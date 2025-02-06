const notFoundRouter = (req, res, next) => {
  const errors = new Error("Not found anything");
  next(errors);
};
const customErrorHandler = (err, req, res, next) => {
  // console.log(err);
  res.status(err.status || 500).json({
    error: err.status === 404 ? "Not Found" : "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
module.exports = { notFoundRouter, customErrorHandler };
