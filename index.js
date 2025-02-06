const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./connectDB/connectDb");
dotenv.config();
const port = process.env.PORT || 3000;

//middlware
//parse json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
// listen to the server port on 3000
app.listen(port, () => {
  console.log("app running on port", port);
});
