import React, { useEffect, useState } from "react";
// import axios from "axios";

const Weather = ({ capital }) => {
  // const weatherApiKey = "xyz";
  // const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  // const capitalWeatherUrl = `${apiUrl}/q=${encodeURI(
  //   capital
  // )}&appid=${weatherApiKey}`;

  const [weather, setWeather] = useState();

  useEffect(() => {
    /* Unfortunately, OpenWeatherMap does not support https */
    // const fetchData = async () => {
    //   try {
    //     const { data } = await axios.get(capitalWeatherUrl);
    //     setWeather(data);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // };
    // fetchData();
    // }, [capitalWeatherUrl]);

    setWeather("cool weather");
  }, []);

  return (
    <div>
      {weather && (
        <>
          <h3>Weather in {capital}</h3>
          <div>{weather}</div>
        </>
      )}
    </div>
  );
};

export default Weather;
