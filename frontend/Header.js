import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DatabaseIcon from "@mui/icons-material/Storage";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ThemeContext from "../context/ThemeContext";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { label: "Accueil", path: "/", icon: <DatabaseIcon /> },
    { label: "Exercices", path: "/exercises", icon: <AssignmentIcon /> },
  ];

  const authItems = isAuthenticated
    ? [
        { label: "Mon Profil", path: "/profile", icon: <PersonIcon /> },
        ...(userRole === "teacher"
          ? [
              {
                label: "Dashboard Enseignant",
                path: "/teacher-dashboard",
                icon: <DashboardIcon />,
              },
            ]
          : []),
      ]
    : [
        { label: "Se Connecter", path: "/login", icon: <LoginIcon /> },
        { label: "S'inscrire", path: "/register", icon: <HowToRegIcon /> },
      ];

  const drawer = (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <DatabaseIcon sx={{ fontSize: 24, mr: 1, color: "primary.main" }} />
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          SQL Eval
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            to={item.path}
            selected={isActive(item.path)}
            onClick={handleDrawerToggle}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(item.path) ? "primary.contrastText" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {authItems.map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            to={item.path}
            selected={isActive(item.path)}
            onClick={handleDrawerToggle}
            sx={{
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(item.path) ? "primary.contrastText" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Se Déconnecter" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={4}
        sx={{ bgcolor: "background.paper", color: "text.primary" }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DatabaseIcon
                sx={{ fontSize: 28, mr: 1, color: "primary.main" }}
              />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: "bold",
                }}
              >
                SQL Eval
              </Typography>
            </Box>
          </motion.div>

          {!isMobile && (
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{ fontWeight: isActive(item.path) ? "bold" : "normal" }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            {isAuthenticated && (
              <IconButton color="inherit" onClick={handleMenu}>
                <Avatar alt="Profile Picture" />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose} component={Link} to="/profile">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Mon Profil" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Se Déconnecter" />
        </MenuItem>
      </Menu>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
