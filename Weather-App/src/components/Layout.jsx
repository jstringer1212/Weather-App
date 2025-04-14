// src/components/Layout.jsx
import React from "react";
import { Container } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Container
      maxWidth="md"
      sx={{
        paddingTop: "2rem",
        paddingBottom: "2rem",
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#057a05",
      }}
    >
      {children}
    </Container>
  );
};

export default Layout;
