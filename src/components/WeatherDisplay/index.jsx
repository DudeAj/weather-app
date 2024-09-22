import React from "react";
import UnitToggle from "../UnitToggle";
import "./WeatherDisplay.css";

const WeatherDisplay = ({ data, unit, setUnit }) => {
  const { name, main, weather } = data;
  const unitSymbol = unit === "metric" ? "°C" : "°F";

  return (
    <div className="weather-display">
      <h1>{name}</h1>
      <div className="weather-data">
        <img
          src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
          alt="weather icon"
        />

        <h2>
          {Math.round(main.temp)}
          {unitSymbol}
        </h2>
        <UnitToggle unit={unit} setUnit={setUnit} />
      </div>
      <p>{weather[0].description}</p>
    </div>
  );
};

export default WeatherDisplay;
