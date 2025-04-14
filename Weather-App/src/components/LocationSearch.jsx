import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { searchCity } from "../services/weatherApi";

const LocationSearch = ({ onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);

  const handleInputChange = async (event, value) => {
    setQuery(value);
    if (!value.trim()) {
      setOptions([]);
      return;
    }
    const data = await searchCity(value);
    setOptions(data);
  };

  const handleSelect = (event, selected) => {
    if (selected) {
      onSelectLocation(selected.lat, selected.lon, selected.name);
      setOptions([]);
      setQuery("");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "1rem auto" }}>
      <Autocomplete
        freeSolo
        disableClearable
        options={options}
        getOptionLabel={(option) =>
          `${option.name}, ${option.state || ""}, ${option.country}`
        }
        onInputChange={handleInputChange}
        onChange={handleSelect}
        inputValue={query}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search city"
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: "white", borderRadius: "8px" }}
          />
        )}
      />
    </div>
  );
};

export default LocationSearch;
