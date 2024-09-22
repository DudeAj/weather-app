import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./SearchCity.css";

const DEBOUNCE_DELAY = 500;

const SearchCity = ({ onCityChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // This useEffect handles the debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        fetchCities(searchTerm); // Only fetch if there's a search term
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(debounceTimer); // Clear the timer on every re-render
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchCities = async (query) => {
    try {
      setLoading(true);
      const apiKey =
        import.meta.env.VITE_WEATHER_API_KEY ||
        "3ae999e8e3c57ec9c66c287be2074b87";
      if (query.length > 2) {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}`
        );

        const cityData = response.data;
        setFilteredCities([cityData.name]);
        setLoading(false);
        setShowDropdown(true);
      } else {
        setFilteredCities([]);
        setLoading(false);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Error fetching city weather:", error);
      setFilteredCities([]);
      setLoading(false);
      setShowDropdown(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    onCityChange(searchTerm);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleSelect = (city) => {
    onCityChange(city);
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length === 0) {
      setShowDropdown(false);
      setFilteredCities([]);
    }
  };

  return (
    <div className="search-city" ref={dropdownRef}>
      <div className="input-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search city..."
          />
          <span className="iconContainer">
            {loading && <p className="search-loader">Loading cities...</p>}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              fill="#908f8f"
              viewBox="0 0 30 30"
            >
              <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
            </svg>
          </span>
          {/* <button type="submit">Search</button> */}

          {showDropdown && filteredCities.length > 0 && (
            <ul className="dropdown">
              {filteredCities.map((city, index) => (
                <li key={index} onClick={() => handleSelect(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchCity;
