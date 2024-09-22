// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherDisplay from "./components/WeatherDisplay";
import SearchCity from "./components/SearchCity";
import ForecastCard from "./components/ForecastCard";
import UnitToggle from "./components/UnitToggle";
import "./App.css";

const App = () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY ||"3ae999e8e3c57ec9c66c287be2074b87";
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState("New York");
  const [unit, setUnit] = useState("metric");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather(city);
    fetchForecast(city);
  }, [city, unit]);


  const fetchWeather = async (cityName) => {
    try {
      //added static for testing
      
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName
        )}&units=${unit}&appid=${apiKey}`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching weather data", error);
      setError("Opps Something went wrong!");
      setWeatherData(null);
    }
  };

  const fetchForecast = async (cityName) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          cityName
        )}&units=${unit}&appid=${apiKey}`
      );
      console.log("response", response);
      // Process forecast data to get daily forecasts
      const dailyData = processForecastData(response.data.list);
      setForecastData(dailyData);
    } catch (error) {
      console.error("Error fetching forecast data", error);
      setForecastData([]);
    }
  };

  const processForecastData = (list) => {
    const daily = {};
    list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString(undefined, { weekday: "long" });
      if (!daily[day]) {
        daily[day] = {
          tempHigh: item.main.temp_max,
          tempLow: item.main.temp_min,
          icon: item.weather[0].icon,
        };
      } else {
        daily[day].tempHigh = Math.max(daily[day].tempHigh, item.main.temp_max);
        daily[day].tempLow = Math.min(daily[day].tempLow, item.main.temp_min);
      }
    });
    // Get next 5 days
    return Object.keys(daily)
      .slice(0, 5)
      .map((day) => ({
        day,
        tempHigh: daily[day].tempHigh,
        tempLow: daily[day].tempLow,
        icon: daily[day].icon,
      }));
  };

  const handleCityChange = (newCity) => {
    setCity(newCity);
  };

  console.log("forcast", forecastData);
  return (
    <div className="app">
      <div className="app-handler">
        <div className="app-data-container">
          <SearchCity onCityChange={handleCityChange} />
          {error && (
            <div className="error">
              <h1>ERROR</h1>
              <p className="error-title">{error}</p>
            </div>
          )}
          {weatherData && (
            <WeatherDisplay data={weatherData} unit={unit} setUnit={setUnit} />
          )}
          <div className="forecast-container">
            {forecastData.map((forecast, index) => (
              <ForecastCard
                key={index}
                day={forecast.day}
                tempHigh={forecast.tempHigh}
                tempLow={forecast.tempLow}
                icon={forecast.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
