const express = require("express");
const app = express();
const connectDB = require("./connectDB/connectDb");
const { notFoundRouter, customErrorHandler } = require("./middleware/errorHandler/errorHnadler");
const usersRoute = require("./router/users/usersRoute");
const cors = require("cors");
const bodyParser = require("body-parser");
const loginRoute = require("./router/loginRoute/loginRoute");
const cookieParser = require("cookie-parser");
const inboxRoute = require("./router/inboxRoute/inboxRoute");

require("dotenv").config();

const port = process.env.PORT || 3000;

app.use(
   cors({
      origin: "http://localhost:5173",
      credentials: true,
   })
);

// serve static file

app.use("/uploads", express.static("public/uploads"));

//parse json data
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOkEI_SECRET));

// users
app.use("/users", usersRoute);

// login
app.use("/auth", loginRoute);

// inbox
app.use("/inbox", inboxRoute);

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
