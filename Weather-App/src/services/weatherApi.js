import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchCurrentWeather = async (lat, lon, unit = "metric") => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      units: unit, // "metric" or "imperial"
      appid: API_KEY,
    },
  });
  console.log("API response:", response.data); // Log the API response
  return response.data;
};

export const fetchFiveDayForecast = async (lat, lon, unit = "metric") => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      units: unit,
      appid: API_KEY,
    },
  });
  return response.data;
};

export const searchCity = async (cityName) => {
  const response = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct`,
    {
      params: {
        q: cityName,
        limit: 5,
        appid: API_KEY,
      },
    }
  );
  return response.data;
};

export const fetchHourlyWeather = async (lat, lon, unit) => {
  const response = await axios.get(`${BASE_URL}/onecall`, {
    params: {
      lat,
      lon,
      exclude: "current,minutely,daily,alerts",
      units: unit,
      appid: API_KEY,
    },
  });
  return response.data.hourly;
}