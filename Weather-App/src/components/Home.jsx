import React, { useState, useEffect } from "react";
import LocationSearch from "../components/LocationSearch";
import CurrentWeather from "../components/CurrentWeather";
import FiveDayForecast from "../components/FiveDayForecast";
import Layout from "../components/Layout";

const Home = () => {
  const [location, setLocation] = useState(null);
  const [unit, setUnit] = useState("metric");

  // Load saved preferences on first render
  useEffect(() => {
    const savedLocation = JSON.parse(localStorage.getItem("homeLocation"));
    const savedUnit = localStorage.getItem("unit");

    if (savedLocation) setLocation(savedLocation);
    if (savedUnit) setUnit(savedUnit);
  }, []);

  const handleSelectLocation = (lat, lon, name) => {
    const newLocation = { lat, lon, name };
    setLocation(newLocation);
    localStorage.setItem("homeLocation", JSON.stringify(newLocation));
  };

  return (
    <Layout>
    <div style={{ padding: "2rem" }}>
      <LocationSearch onSelectLocation={handleSelectLocation} />
      <CurrentWeather location={location} unit={unit} />
      {location && <FiveDayForecast location={location} unit={unit} />}
    </div>
    </Layout>
  );
};

export default Home;
