import React from "react";

const Person = ({ person, onDeletePerson }) => {
  const { id, name, number } = person;

  const handleDeletePerson = () => {
    if (window.confirm(`Delete ${name}?`)) {
      onDeletePerson(id, person.name);
    }
  };

  return (
    <p>
      <strong>{name} </strong>
      <span>{number} </span>
      <button onClick={handleDeletePerson}>delete</button>
    </p>
  );
};

export default Person;
