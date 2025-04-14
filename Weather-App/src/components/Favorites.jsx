// src/components/Favorites.jsx

import React, { useEffect, useState, useContext } from "react";
import { fetchCurrentWeather } from "../services/weatherApi";
import { UnitContext } from "../components/UnitContext";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "./Layout";

const Favorites = () => {
  const { unit } = useContext(UnitContext);
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);

    const loadWeatherForFavorites = async () => {
      setLoading(true);
      const data = {};
      for (const loc of stored) {
        const weather = await fetchCurrentWeather(loc.lat, loc.lon, unit);
        data[loc.name] = weather;
      }
      setWeatherData(data);
      setLoading(false);
    };

    loadWeatherForFavorites();
  }, [unit]);

  const handleRemove = (name) => {
    const updated = favorites.filter((loc) => loc.name !== name);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    const newData = { ...weatherData };
    delete newData[name];
    setWeatherData(newData);
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  if (favorites.length === 0) {
    return <Typography sx={{ mt: 4, textAlign: "center" }}>No favorites yet.</Typography>;
  }

  return (
    
    <Grid container spacing={2} >
      {favorites.map((loc) => {
        const weather = weatherData[loc.name];
        return (
          <Layout>
          <Grid item xs={12} sm={6} md={4} key={loc.name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{loc.name}</Typography>
                {weather ? (
                  <>
                    <Typography>{weather.main.temp}° {unit === "metric" ? "C" : "F"} </Typography>
                    <Typography>{weather.weather[0].description}</Typography>
                  </>
                ) : (
                  <Typography>No weather data</Typography>
                )}
                <IconButton
                  aria-label="remove"
                  onClick={() => handleRemove(loc.name)}
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
          </Layout>
        );
      })}
    </Grid>
    
  );
};

export default Favorites;
