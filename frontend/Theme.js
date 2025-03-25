// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

export const getTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#1E2A44" : "#F5F5F5",
        paper: darkMode ? "#2A3B5A" : "#FFFFFF",
      },
      text: {
        primary: darkMode ? "#E0E7FF" : "#1E2A44",
        secondary: darkMode ? "#A3BFFA" : "#4B6CB7",
      },
      primary: {
        main: darkMode ? "#3B82F6" : "#1976D2",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: darkMode ? "#4B6CB7" : "#B0BEC5",
      },
    },
    transitions: {
      duration: {
        enteringScreen: 500,
        leavingScreen: 200,
      },
    },
  });
