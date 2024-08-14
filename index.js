require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Contact = require("./models/contact");
const app = express();

const requestLogger = (request, response, next) => {
  console.log("Method", request.method);
  console.log("Path", request.path);
  console.log("Body", request.body);
  next();
};

const errorHandler = (error, request, response, next) => {
  console.log("error", error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (request, response) => {
  response.send("<h1>Hello world</h1>");
});

app.get("/api/phonebook", (request, response) => {
  Contact.find({}).then((result) => response.json(result));
});

app.get("/api/phonebook/:id", (request, response, next) => {
  const id = request.params.id;
  Contact.findById(id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/phonebook", (request, response, next) => {
  const body = request.body;
  if (!body) {
    response.json({ error: "content missing" });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  contact
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/phonebook/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;

  Contact.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: express.query }
  )
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.delete("/api/phonebook/:id", (request, response, next) => {
  const id = request.params.id;

  Contact.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
