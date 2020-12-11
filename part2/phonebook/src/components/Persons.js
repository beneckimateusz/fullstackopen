import React from "react";
import Person from "./Person";

const Persons = ({ persons, onDeletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person
          key={person.id}
          person={person}
          onDeletePerson={onDeletePerson}
        />
      ))}
    </div>
  );
};

export default Persons;
