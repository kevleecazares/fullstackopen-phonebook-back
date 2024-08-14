require("dotenv").config();

const mongoose = require("mongoose");

const url = process.env.MONGO_DB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => console.log("connected to mongodb"))
  .catch((error) => console.log("error connecting to mongodb", error.message));

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
