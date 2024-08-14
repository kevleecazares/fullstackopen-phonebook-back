require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGO_DB_URI;
console.log("connecting to", url);

mongoose
  .connect(url)
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.log("error connecting to mongodb", error.message));

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
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
