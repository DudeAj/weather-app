import React from "react";
import "./ForecastCard.css";

const ForecastCard = ({ day, tempHigh, tempLow, icon }) => {
  return (
    <div className="forecast-card">
      <div>
        <div>
          <p className="day">{day}</p>
        </div>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="weather icon"
        />
      </div>
      <div>
        <p className="temp-high">High: {Math.round(tempHigh)}°</p>
        <p className="temp-low">Low: {Math.round(tempLow)}°</p>
      </div>
    </div>
  );
};

export default ForecastCard;
