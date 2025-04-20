const createError = require("http-errors");

const notFoundRouter = (req, res, next) => {
   const errors = createError(404, "Somthing will be wrong");
   next(errors);
};
const customErrorHandler = (err, req, res, next) => {
   res.status(err.status || 500).json({
      error: err.status === 404 ? "Not Found" : "Internal Server Error",
   });
};
module.exports = { notFoundRouter, customErrorHandler };
