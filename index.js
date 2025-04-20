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
const { createServer } = require("http");
const socketConnectionHandler = require("./socket/socket");
const callRouter = require("./router/callRoute/callRoute");

require("dotenv").config();

const httpServer = createServer(app);

const io = socketConnectionHandler(httpServer);

app.use(
   cors({
      origin: "http://localhost:5173",
      credentials: true,
   })
);

app.use((req, res, next) => {
   req.io = io;
   next();
});

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

// For call
app.use("/call", callRouter);

// connect to Mongodb database
connectDB();

// wrong route
app.use(notFoundRouter);

// custom error handler
app.use(customErrorHandler);

// Listen to HTTP server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
   console.log(`Server running on port ${port}`);
});

global.io = io;
