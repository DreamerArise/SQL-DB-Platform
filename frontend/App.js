import React, { useContext, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { ThemeProvider, ThemeContext } from "./pages/ThemeContext";
import { getTheme } from "./pages/Theme";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ExerciseList from "./pages/ExerciseList";
import SubmissionForm from "./pages/SubmissionForm";
import SubmissionList from "./pages/SubmissionList";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherSubmissions from "./pages/TeacherSubmissions";
import StudentPerformance from "./pages/StudentPerformance";
import TeacherStatistics from "./pages/TeacherStatistics";

const ProtectedRoute = ({ element, allowedRoles, ...rest }) => {
  const userRole = localStorage.getItem("role");
  const accessToken = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <Navigate to="/profile" replace state={{ error: "Accès non autorisé" }} />
    );
  }

  return element;
};

const NotFound = () => {
  const location = useLocation();
  return <h2>Page non trouvée : {location.pathname}</h2>;
};

function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}

function AppWithTheme() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  if (darkMode === undefined) {
    return <div>Chargement du thème...</div>;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {/* Supprimer ToastContainer temporairement */}
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontFamily: '"Montserrat", sans-serif',
              textShadow: "1px 1px 1px rgba(0,0,0,0.15)",
              letterSpacing: "0.5px",
              "& a": {
                color: "inherit",
                textDecoration: "none",
                position: "relative",
                padding: "3px 8px",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "2px",
                  background: "currentColor",
                  transform: "scaleX(0)",
                  transition: "transform 0.3s ease",
                  transformOrigin: "center",
                },
                "&:hover::after": {
                  transform: "scaleX(1)",
                },
              },
            }}
          >
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Smart Query
            </Link>
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                color="secondary"
              />
            }
            label="Mode sombre"
            labelPlacement="start"
          />
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/exercises" element={<ExerciseList />} />
        <Route path="/submit" element={<SubmissionForm />} />
        <Route
          path="/submissions"
          element={
            <ProtectedRoute
              element={<SubmissionList />}
              allowedRoles={["student"]}
            />
          }
        />
        <Route
          path="/student-performance"
          element={
            <ProtectedRoute
              element={<StudentPerformance />}
              allowedRoles={["student"]}
            />
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute
              element={<TeacherDashboard />}
              allowedRoles={["teacher"]}
            />
          }
        />
        <Route
          path="/teacher-dashboard/submissions/:exerciseId"
          element={
            <ProtectedRoute
              element={<TeacherSubmissions />}
              allowedRoles={["teacher"]}
            />
          }
        />
        <Route
          path="/teacher-statistics"
          element={
            <ProtectedRoute
              element={<TeacherStatistics />}
              allowedRoles={["teacher"]}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MuiThemeProvider>
  );
}

export default App;
