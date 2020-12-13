const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to mongodb...");

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((_) => console.log("connected to mongodb"))
  .catch((err) => console.log("error connecting to mongodb:", err.message));
