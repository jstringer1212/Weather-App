import React, { useEffect, useState, useContext } from "react";
import { fetchCurrentWeather } from "../services/weatherApi";
import { UnitContext } from "../components/UnitContext";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

const CurrentWeather = ({ location }) => {
  const { unit } = useContext(UnitContext); // 👈 use unit from context
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeLocation, setActiveLocation] = useState(location);
  const [showCoords, setShowCoords] = useState(false);

  // Fetch weather data
  const loadWeather = async (lat, lon, unitType) => {
    setLoading(true);
    try {
      const data = await fetchCurrentWeather(lat, lon, unitType);
      setWeather(data);
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load weather when location or unit changes
  useEffect(() => {
    if (!unit) return; // Wait for unit to be available

    const storedShowCoords = JSON.parse(localStorage.getItem("showCoords")) || false;
    setShowCoords(storedShowCoords);

    if (location) {
      setActiveLocation(location);
      loadWeather(location.lat, location.lon, unit);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const geoLoc = { lat: latitude, lon: longitude, name: "Current Location" };
          setActiveLocation(geoLoc);
          loadWeather(latitude, longitude, unit);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLoading(false);
        }
      );
    }
  }, [location, unit]);

  // Check if location is favorited
  useEffect(() => {
    if (activeLocation) {
      const stored = JSON.parse(localStorage.getItem("favorites")) || [];
      const exists = stored.find(
        (fav) => fav.lat === activeLocation.lat && fav.lon === activeLocation.lon
      );
      setIsFavorited(!!exists);
    }
  }, [activeLocation]);

  const handleToggleFavorite = () => {
    if (!activeLocation) return;
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = stored.find(
      (fav) => fav.lat === activeLocation.lat && fav.lon === activeLocation.lon
    );

    if (exists) {
      const updated = stored.filter(
        (fav) => fav.lat !== activeLocation.lat || fav.lon !== activeLocation.lon
      );
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorited(false);
    } else {
      stored.push(activeLocation);
      localStorage.setItem("favorites", JSON.stringify(stored));
      setIsFavorited(true);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (!weather) return <Typography>Weather data unavailable.</Typography>;

  return (
    
    <Card sx={{ width: '80%', maxWidth: '95vw', margin: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {weather.name} 
        </Typography>
        {showCoords && (
          <Typography variant="h6" gutterBottom>
            Latitude: {weather.coord.lat}, Longitude: {weather.coord.lon}
          </Typography>
        )}
        <Typography variant="h6">
          Currently: {" "}
          {Math.round(weather.main.temp)}° {unit === "metric" ? "C" : "F"} 
          <br></br>
          Feels like {Math.round(weather.main.feels_like)}° {unit === "metric" ? "C" : "F"}
          <br></br>
          {weather.weather[0].description}
        </Typography>
        <Typography>Humidity: {weather.main.humidity}%</Typography>
        <Typography>
          Wind: {weather.wind.speed} {unit === "metric" ? "m/s" : "mph"}
        </Typography>

        {activeLocation && (
          <Tooltip title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}>
            <IconButton onClick={handleToggleFavorite} sx={{ mt: 2 }}>
              {isFavorited ? (
                <StarIcon sx={{ color: "#FFD700" }} />
              ) : (
                <StarBorderIcon />
              )}
            </IconButton>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
