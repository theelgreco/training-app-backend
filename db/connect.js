const ENV = process.env.NODE_ENV;
require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });
console.log(ENV, "<------------------------ this one");

const db =
  ENV === "production" ? process.env.MONGO_URI : process.env.MONGO_URI_DEV;

const mongoose = require("mongoose");

try {
  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(db);
  console.log("connection to database successful");
} catch (error) {
  console.log("error connecting to database... ");
  console.error(error);
}

module.exports = mongoose;
