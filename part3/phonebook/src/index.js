require("dotenv").config();
require("./db/mongoose");
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static("build"));

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan((tokens, req, res) => {
    let format = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ];

    if (req.method === "POST") {
      format.splice(4, 0, tokens.body(req, res));
    }

    return format.join(" ");
  })
);

app.get("/info", async (req, res) => {
  const count = await Person.countDocuments();

  const html = `
    <p>Phonebook has info for ${count} people</p>
    <p>${new Date().toString()}</p> 
  `;

  res.send(html);
});

// API
app.get("/api/persons", async (req, res) => {
  const persons = await Person.find({});

  res.send(persons);
});

app.post("/api/persons", async (req, res, next) => {
  try {
    const person = new Person(req.body);

    await person.save();
    res.status(201).send(person);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);

    person ? res.send(person) : res.status(404).send();
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  try {
    const { name, number } = req.body;

    const person = { name, number };
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      person,
      { new: true, runValidators: true, context: "query" }
    );

    res.send(updatedPerson);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// error handlers
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
