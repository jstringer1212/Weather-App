// src/components/Settings.jsx

import React, { useState, useEffect } from "react";
import { fetchCurrentWeather } from "../services/weatherApi";
import { searchCity } from "../services/weatherApi";
import {
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Box,
    Switch,
    FormControlLabel,
} from "@mui/material";
import LocationSearch from "./LocationSearch";
import Layout from "./Layout";
import { Form } from "react-router-dom";

const Settings = () => {
  const [unit, setUnit] = useState("metric");
  const [homeLocation, setHomeLocation] = useState(null);
  const [showCoords, setshowCoords] = useState({ lat: null, lon: null });

  useEffect(() => {
    const detectUnitByLocation = async () => {
      try {
        const location = await searchCity("New York"); 
        const { lat, lon } = location[0]; 
        const weatherData = await fetchCurrentWeather(lat, lon);
        
        const country = weatherData.sys.country;
  
        const defaultUnit = country === "US" ? "imperial" : "metric";
        setUnit(defaultUnit);
        localStorage.setItem("unit", defaultUnit);
      } catch (error) {
        console.error("Failed to detect unit by location:", error);
      }
    };
  
    const savedUnit = localStorage.getItem("unit");
    if (!savedUnit) {
      detectUnitByLocation();
    } else {
      setUnit(savedUnit);
    }
  }, []);
  
  

  const handleUnitChange = (e) => {
    const selected = e.target.value;
    setUnit(selected);
    localStorage.setItem("unit", selected);
  };

  const handleLocationSelect = (lat, lon, name) => {
    const location = { lat, lon, name };
    setHomeLocation(location);
    localStorage.setItem("homeLocation", JSON.stringify(location));
  };

    const handleCoordsToggle = ()=> {
        setshowCoords(!showCoords);
        localStorage.setItem("showCoords", !showCoords);
    };
  return (
    <Layout>
    <Paper sx={{ maxWidth: 500, margin: "2rem auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Units</InputLabel>
        <Select value={unit} label="Units" onChange={handleUnitChange}>
          <MenuItem value="metric">Metric (°C, m/s)</MenuItem>
          <MenuItem value="imperial">Imperial (°F, mph)</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="h6" gutterBottom>
        Set Home Location
      </Typography>
      <LocationSearch onSelectLocation={handleLocationSelect} />

      {homeLocation && (
        <Box mt={2}>
          <Typography>
            Current Home: {homeLocation.name}
          </Typography>
          {/* Display coordinates if showCoords is true */}
          <FormControlLabel
                control={<Switch checked={showCoords} onChange={handleCoordsToggle} />}
                label="Show Coordinates"
            />
        </Box>
      )}
    </Paper>
    </Layout>
  );
};

export default Settings;
