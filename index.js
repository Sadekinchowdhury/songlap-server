const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGODB_URI;

//middlware
//parse json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
const connectToDatabase = async function () {
  try {
    const connect = await mongoose.connect(mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("monogdb and mongoose is connected succesfully");
  } catch (err) {
    console.log(err.message);
  }
};
connectToDatabase();

// listen to the server port on 3000
app.listen(port, () => {
  console.log("app running on port", port);
});
