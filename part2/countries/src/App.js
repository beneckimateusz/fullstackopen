import axios from "axios";
import React, { useEffect, useState } from "react";
import Countries from "./components/Countries";
import "./styles.css";

export default function App() {
  const [nameFilter, setNameFilter] = useState("");
  const [countries, setCountries] = useState([]);
  const [insufficientFilter, setInsufficientFilter] = useState(false);

  const apiUrl = "https://restcountries.eu/rest/v2";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/name/${nameFilter}`);
        const { data } = response;

        if (data.length <= 10) {
          setInsufficientFilter(false);
          return data;
        } else {
          setInsufficientFilter(true);
          return [];
        }
      } catch (e) {
        console.error(e);
        setInsufficientFilter(false);
        return [];
      }
    };

    if (nameFilter.length > 0) {
      const delayDebounceFn = setTimeout(async () => {
        const newCountries = await fetchData();
        setCountries(newCountries);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setInsufficientFilter(false);
      setCountries([]);
    }
  }, [nameFilter]);

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  };

  console.log(insufficientFilter);

  return (
    <div className="App">
      <div>
        <span>find countries </span>
        <input
          type="text"
          value={nameFilter}
          onChange={handleNameFilterChange}
        />
      </div>
      {insufficientFilter ? (
        <h3>Too many matches, specify another filter</h3>
      ) : (
        <Countries countries={countries} />
      )}
    </div>
  );
}
