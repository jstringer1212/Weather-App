// src/components/NavBar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Button color="inherit" component={Link} to="/"
            sx={{ '&:hover': {backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#fff"} }}>
            Home
          </Button>
          <Button color="inherit" component={Link} to="/favorites"
            sx={{ '&:hover': {backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#fff"} }}>
            Favorites
          </Button>
        </Box>

        <IconButton color="inherit" component={Link} to="/settings"
          sx={{ '&:hover': {backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#fff"} }}>
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
