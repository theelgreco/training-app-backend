require("dotenv").config();
const db = process.env.MONGO_URI;
const mongoose = require("mongoose");

try {
  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connection to database successful");
} catch (error) {
  console.log("error connecting to database... ");
  console.error(error);
}

module.exports = mongoose;
