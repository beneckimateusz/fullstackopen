import React from "react";
import Weather from "./Weather";

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {country.languages.map((lang) => (
          <li key={lang.iso639_1}>{lang.name}</li>
        ))}
      </ul>
      <img alt={`${country.name} flag`} src={country.flag} height="128" />
      <Weather capital={country.capital} />
    </div>
  );
};

export default Country;
