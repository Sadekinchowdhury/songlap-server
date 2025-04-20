const { default: mongoose } = require("mongoose");

const connectDB = () => {
  const mongoDbUri = process.env.MONGODB_URI;
  // database connection
  const connectToDatabase = async function () {
    try {
      const connect = await mongoose.connect(mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true });
 
    } catch (err) {
      console.log(err.message);
    }
  };
  connectToDatabase();
};
module.exports = connectDB;
