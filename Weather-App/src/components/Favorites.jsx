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
  Box,
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

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          px: 2,
          py: 4,
        }}
      >
        {loading ? (
          <CircularProgress sx={{ mx: "auto", my: "auto" }} />
        ) : favorites.length === 0 ? (
          <Typography sx={{ mt: 4, textAlign: "center" }}>
            No favorites yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {favorites.map((loc) => {
              const weather = weatherData[loc.name];
              return (
                <Grid item xs={12} sm={6} md={4} key={loc.name} sx={{ display: "flex" }}>
                  <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column"}}>
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <Typography variant="h6">{loc.name}</Typography>
                        {weather ? (
                          <>
                            <Typography>
                              {weather.main.temp}° {unit === "metric" ? "C" : "F"}
                            </Typography>
                            <Typography>{weather.weather[0].description}</Typography>
                          </>
                        ) : (
                          <Typography>No weather data</Typography>
                        )}
                      </div>
                      <IconButton
                        aria-label="remove"
                        onClick={() => handleRemove(loc.name)}
                        sx={{ mt: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default Favorites;
