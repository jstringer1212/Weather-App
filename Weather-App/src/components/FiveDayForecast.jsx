// src/components/FiveDayForecast.jsx
import React, { useEffect, useState } from "react";
import { fetchFiveDayForecast } from "../services/weatherApi";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import dayjs from "dayjs";

const groupForecastByDay = (list) => {
  const grouped = {};

  list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(entry);
  });

  return Object.entries(grouped).slice(0, 5); // Only next 5 days
};

const FiveDayForecast = ({ location, unit }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadForecast = async (lat, lon) => {
    setLoading(true);
    const data = await fetchFiveDayForecast(lat, lon, unit);
    setForecastData(groupForecastByDay(data.list));
    setLoading(false);
  };

  useEffect(() => {
    if (location) {
      loadForecast(location.lat, location.lon);
    }
  }, [location, unit]);

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Grid container spacing={2} sx={{ mt: 4, justifyContent: "center" }}>
  {forecastData.map(([date, entries], index) => {
    const day = dayjs(date).format("dddd");
    const temps = entries.map((e) => e.main.temp);
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(0);
    const weather = entries[2]?.weather?.[0] || entries[0]?.weather?.[0];
    const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

    return (
      <Grid
        key={index}
        sx={{
          flexBasis: {
            xs: "100%",
            sm: "45%",
            md: "30%",
            lg: "18%",
          },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 240 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h6">{day}</Typography>
            <CardMedia
              component="img"
              image={iconUrl}
              alt={weather.description}
              sx={{ width: 80, height: 80, margin: "0 auto" }}
            />
            <Typography>
              {avgTemp}° {unit === "metric" ? "C" : "F"}
            </Typography>
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {weather.description}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  })}
</Grid>

  );
};

export default FiveDayForecast;
