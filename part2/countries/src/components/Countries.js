import React, { useEffect, useState } from "react";
import Country from "./Country";

const Countries = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState();

  useEffect(() => {
    if (countries.length === 1) {
      setSelectedCountry(countries[0]);
    }
  }, [countries]);

  const listOfCountries = countries.map((country) => (
    <div key={country.alpha2Code}>
      {country.name}
      <button onClick={() => setSelectedCountry(country)}>show</button>
    </div>
  ));

  return (
    <div>
      {countries.length > 1 && listOfCountries}
      {selectedCountry && <Country country={selectedCountry} />}
    </div>
  );
};

export default Countries;
