const express = require("express");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3001;

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(express.static("build"));
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

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

const getRandomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

app.get("/info", (req, res) => {
  const html = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p> 
  `;

  res.send(html);
});

// API
app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.post("/api/persons", (req, res) => {
  const { body } = req;
  if (!body.name || !body.number) {
    return res.status(400).send({ error: "Either name or number is missing" });
  }

  if (persons.findIndex((p) => p.name === body.name) !== -1) {
    return res
      .status(400)
      .send({ error: "This name already exists in phonebook" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getRandomInteger(1, 1000),
  };
  persons.push(person);
  res.status(201).send(person);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  person ? res.send(person) : res.status(404).send();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
