// src/components/FavoriteLocations.jsx
import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const FavoriteLocations = ({ onSelect }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  const handleDelete = (index) => {
    const updated = favorites.filter((_, i) => i !== index);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  return (
    <Paper sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        ⭐ Favorite Locations
      </Typography>
      {favorites.length === 0 ? (
        <Typography variant="body2">No favorites yet.</Typography>
      ) : (
        <List>
          {favorites.map((fav, index) => (
            <ListItem
              button
              key={index}
              onClick={() => onSelect(fav.lat, fav.lon, fav.name)}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={fav.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default FavoriteLocations;
