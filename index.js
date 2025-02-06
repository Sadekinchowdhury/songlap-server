const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./connectDB/connectDb");
const { notFoundRouter, customErrorHandler } = require("./middleware/errorHandler/errorHnadler");
dotenv.config();
const port = process.env.PORT || 3000;

//parse json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to Mongodb database
connectDB();

// wrong route
app.use(notFoundRouter);
app.use(customErrorHandler);

// listen to the server port on 3000
app.listen(port, () => {
  console.log("app running on port", port);
});
