import React, { useState, useEffect } from "react";
import "./styles.css";
import personService from "./services/persons";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [ackMessage, setAckMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await personService.getAll();
        setPersons(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  const addPerson = async (event, name, number) => {
    event.preventDefault();
    const matchingPerson = persons.find((p) => p.name === name);
    let shouldUpdate = false;

    if (matchingPerson) {
      shouldUpdate = window.confirm(
        `${name} is already added to phonebook, replace the old number with a new one?`
      );
    }

    const newPerson = {
      name,
      number
    };

    try {
      if (!matchingPerson) {
        const data = await personService.create(newPerson);
        setPersons([...persons, data]);
        showMessage(setAckMessage, `Added ${data.name}`);
      } else if (matchingPerson && shouldUpdate) {
        const updatedPerson = await personService.update({
          ...matchingPerson,
          number
        });
        const newPersons = persons.map((p) =>
          p.id !== matchingPerson.id ? p : updatedPerson
        );
        setPersons(newPersons);
        showMessage(setAckMessage, `Updated ${updatedPerson.name}'s number`);
      }
    } catch (e) {
      // unfortunately handling error from update() here
      // wanted to handle both cases in one place but noticed
      // that it brings more pain than benefits
      showMessage(
        setErrorMessage,
        `Information of ${name} has already been removed from server`
      );
      setPersons(persons.filter((p) => p.id !== matchingPerson.id));
      console.error(e);
    }
  };

  const deletePerson = async (id, name) => {
    try {
      await personService.remove(id);
      const newPersons = persons.filter((p) => p.id !== id);
      setPersons(newPersons);
      showMessage(setAckMessage, `Deleted ${name}`);
    } catch (e) {
      showMessage(
        setErrorMessage,
        `Information of ${name} has already been removed from server`
      );
      setPersons(persons.filter((p) => p.id !== id));
      console.error(e);
    }
  };

  const showMessage = (setMessage, message) => {
    setMessage(message);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  };

  const filteredPersons =
    nameFilter.length > 0
      ? persons.filter(({ name }) =>
          name.toLowerCase().includes(nameFilter.toLowerCase())
        )
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type="error" message={errorMessage} />
      <Notification type="ack" message={ackMessage} />
      <Filter value={nameFilter} onChange={handleNameFilterChange} />
      <h3>add a new</h3>
      <PersonForm onAddPerson={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDeletePerson={deletePerson} />
    </div>
  );
};

export default App;
