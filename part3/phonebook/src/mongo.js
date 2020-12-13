const mongoose = require("mongoose");

if (process.argv.length < 3 || process.argv.length === 4) {
  console.log("Usage: node mongo.js <password> [name] [number]");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://mateusz:${password}@fullstackopen-part3.lzmi0.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Person = new mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach(({ name, number }) => console.log(`${name}: ${number}`));
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];
  const newPerson = new Person({ name, number });

  newPerson.save().then((_) => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
