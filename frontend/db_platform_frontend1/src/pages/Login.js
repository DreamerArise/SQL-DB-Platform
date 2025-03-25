import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Composants stylisés
const TransparentPaper = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(8px)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  padding: theme.spacing(4),
  width: "100%",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "& input": {
      color: "white",
    },
  },
  "& label": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& label.Mui-focused": {
    color: "rgba(221, 230, 233, 0.9)",
  },
}));

const AnimatedBackground = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(125deg, #00B4DB, #0083B0, #304352, #2C5364)",
    backgroundSize: "400% 400%",
    animation: "gradient 15s ease infinite",
  },
  "@keyframes gradient": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
});

// Composant pour les bulles d'animation
const Bubbles = styled(Box)({
  position: "absolute",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  "& div": {
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    animation: "rise 15s infinite",
    bottom: "-100px",
  },
  "@keyframes rise": {
    "0%": {
      transform: "translateY(0) scale(1)",
      opacity: 1,
    },
    "100%": {
      transform: "translateY(-1000px) scale(2)",
      opacity: 0,
    },
  },
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Génère aléatoirement les positions des bulles
  const bubbles = [...Array(15)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${20 + Math.random() * 40}px`,
    height: `${20 + Math.random() * 40}px`,
    animationDelay: `${Math.random() * 15}s`,
    animationDuration: `${10 + Math.random() * 20}s`,
  }));

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://sql-db-platform-1.onrender.com/api/token/",
        {
          username,
          password,
        }
      );
      const accessToken = response.data.access;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", response.data.refresh);
      console.log("Token stocké:", accessToken);

      // Récupérer les informations de l'utilisateur pour obtenir le rôle
      const userResponse = await axios.get(
        "https://sql-db-platform-1.onrender.com/api/user/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const isTeacher = userResponse.data.is_teacher;
      const userRole = isTeacher ? "teacher" : "student";
      localStorage.setItem("role", userRole); // Stocke le rôle correct
      console.log("Utilisateur:", userResponse.data);
      console.log("Rôle stocké:", userRole);

      navigate("/profile");
    } catch (err) {
      setError("Échec de la connexion. Vérifie tes identifiants.");
      console.error(
        "Erreur de connexion:",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Arrière-plan animé */}
      <AnimatedBackground>
        <Bubbles>
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              style={{
                left: bubble.left,
                width: bubble.width,
                height: bubble.height,
                animationDelay: bubble.animationDelay,
                animationDuration: bubble.animationDuration,
              }}
            />
          ))}
        </Bubbles>
      </AnimatedBackground>

      {/* Contenu de la page de connexion */}
      <Container maxWidth="sm">
        <TransparentPaper elevation={0}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 600,
              color: "white",
              marginBottom: 4,
              textShadow: "0px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Connexion
          </Typography>

          <form onSubmit={handleLogin}>
            <StyledTextField
              label="Nom d'utilisateur"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <StyledTextField
              label="Mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography
                color="error"
                sx={{
                  textAlign: "center",
                  background: "rgba(255,0,0,0.1)",
                  padding: 1,
                  borderRadius: 1,
                  marginTop: 1,
                  marginBottom: 2,
                  color: "white",
                }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "8px",
                padding: "12px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                fontWeight: 600,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Se connecter
            </Button>
          </form>
        </TransparentPaper>
      </Container>
    </Box>
  );
}

export default Login;
