const express = require("express");

const app = express();
const dotenv = require("dotenv");
const connectDB = require("./connectDB/connectDb");
const { notFoundRouter, customErrorHandler } = require("./middleware/errorHandler/errorHnadler");
const usersRoute = require("./router/users/usersRoute");
const cors = require("cors");

const bodyParser = require("body-parser");
const loginRoute = require("./router/loginRoute/loginRoute");

dotenv.config();
const port = process.env.PORT || 3000;

app.use(cors());

//parse json data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// users
app.use("/users", usersRoute);

// login
app.use("/login", loginRoute);

// inbox

// connect to Mongodb database
connectDB();

// wrong route
app.use(notFoundRouter);

// custom error handler
app.use(customErrorHandler);

// listen to the server port on 3000
app.listen(port, () => {
  console.log("app running on port", port);
});
