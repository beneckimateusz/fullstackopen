import React, { useState } from "react";

const PersonForm = ({ onAddPerson }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  return (
    <form>
      <div>
        name: <input value={name} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={number} onChange={handleNumberChange} />
      </div>
      <div>
        <button
          type="submit"
          onClick={(event) => onAddPerson(event, name, number)}
        >
          add
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
