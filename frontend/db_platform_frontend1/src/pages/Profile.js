import React, { useState, useEffect } from "react";
import {
  Typography,
  //Button,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  //Grid,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// Import des icônes
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Profile() {
  const [isTeacher, setIsTeacher] = useState(null); // null indique un état de chargement
  const [userName, setUserName] = useState("");
  const [activeSection, setActiveSection] = useState("submissions"); // Par défaut, affiche les soumissions
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (!accessToken) {
      console.log("Aucun token trouvé, redirection vers /login");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://sql-db-platform-1.onrender.com/api/user/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const isTeacherFromApi = response.data.is_teacher;
        setIsTeacher(isTeacherFromApi);
        // Si le nom d'utilisateur est disponible dans la réponse API
        if (response.data.username) {
          setUserName(response.data.username);
        }
        const role = isTeacherFromApi ? "teacher" : "student";
        if (userRole !== role) {
          localStorage.setItem("role", role); // Synchronise le rôle
          console.log("Rôle mis à jour dans localStorage:", role);
        }
        console.log("Utilisateur récupéré:", response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des infos utilisateur:",
          error
        );
        navigate("/login");
      }
    };
    fetchUser();

    // Détermine la section active basée sur le chemin actuel
    const path = location.pathname;
    if (path.includes("submissions")) {
      setActiveSection("submissions");
    } else if (path.includes("performance")) {
      setActiveSection("performance");
    } else if (path.includes("exercises")) {
      setActiveSection("exercises");
    } else if (path.includes("submit")) {
      setActiveSection("submit");
    } else if (path.includes("dashboard")) {
      setActiveSection("dashboard");
    } else if (path.includes("statistics")) {
      setActiveSection("statistics");
    }
  }, [accessToken, navigate, userRole, location]);

  if (isTeacher === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Chargement de votre profil...
        </Typography>
      </Box>
    );
  }

  const handleNavigation = (section) => {
    setActiveSection(section);

    switch (section) {
      case "exercises":
        navigate("/exercises");
        break;
      case "submit":
        navigate("/submit");
        break;
      case "submissions":
        navigate("/submissions");
        break;
      case "performance":
        navigate("/student-performance");
        break;
      case "dashboard":
        navigate("/teacher-dashboard");
        break;
      case "statistics":
        navigate("/teacher-statistics");
        break;
      default:
        navigate("/");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "submissions":
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Mes soumissions
            </Typography>
            <Card
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6">Evolution des performances</Typography>
                <Typography color="textSecondary">
                  Consultez l'historique de toutes vos réponses et leurs
                  évaluations.
                </Typography>
                {/* Ici viendrait le contenu réel des soumissions */}
                <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
                  Le contenu des soumissions sera chargé depuis l'API.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      case "performance":
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Mes performances
            </Typography>
            <Card
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6">Analyse des performances</Typography>
                <Typography color="textSecondary">
                  Visualisez vos progrès et performances sur les différents
                  exercices.
                </Typography>
                {/* Ici viendrait le contenu réel des performances */}
                <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
                  Les graphiques de performance seront chargés depuis l'API.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      case "dashboard":
        return (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Tableau de bord enseignant
            </Typography>
            <Card
              sx={{
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6">Gestion des classes</Typography>
                <Typography color="textSecondary">
                  Gérez vos classes et surveillez la progression des étudiants.
                </Typography>
                {/* Ici viendrait le contenu réel du tableau de bord */}
                <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic" }}>
                  Les données du tableau de bord seront chargées depuis l'API.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );
      default:
        return (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5">
              Sélectionnez une option dans le menu de gauche
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Sidebar de navigation - à gauche */}
      <Paper
        sx={{
          width: 250,
          flexShrink: 0,
          borderRadius: 0,
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Tableau de bord
          </Typography>
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1 }}>
          {/* Options communes */}
          <ListItem
            button
            onClick={() => handleNavigation("exercises")}
            selected={activeSection === "exercises"}
            sx={{
              "&.Mui-selected": { bgcolor: "rgba(25, 118, 210, 0.08)" },
              "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
            }}
          >
            <ListItemIcon>
              <AssignmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Exercices" />
          </ListItem>

          {/* Options pour étudiants */}
          {!isTeacher && (
            <>
              <ListItem
                button
                onClick={() => handleNavigation("submit")}
                selected={activeSection === "submit"}
                sx={{
                  "&.Mui-selected": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                }}
              >
                <ListItemIcon>
                  <SendIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary="Soumettre" />
              </ListItem>

              <ListItem
                button
                onClick={() => handleNavigation("submissions")}
                selected={activeSection === "submissions"}
                sx={{
                  "&.Mui-selected": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                }}
              >
                <ListItemIcon>
                  <HistoryIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Mes soumissions" />
              </ListItem>

              <ListItem
                button
                onClick={() => handleNavigation("performance")}
                selected={activeSection === "performance"}
                sx={{
                  "&.Mui-selected": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                }}
              >
                <ListItemIcon>
                  <BarChartIcon sx={{ color: "#4caf50" }} />
                </ListItemIcon>
                <ListItemText primary="Mes performances" />
              </ListItem>
            </>
          )}

          {/* Options pour enseignants */}
          {isTeacher && (
            <>
              <ListItem
                button
                onClick={() => handleNavigation("dashboard")}
                selected={activeSection === "dashboard"}
                sx={{
                  "&.Mui-selected": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                }}
              >
                <ListItemIcon>
                  <DashboardIcon sx={{ color: "#ff9800" }} />
                </ListItemIcon>
                <ListItemText primary="Tableau de bord" />
              </ListItem>

              <ListItem
                button
                onClick={() => handleNavigation("statistics")}
                selected={activeSection === "statistics"}
                sx={{
                  "&.Mui-selected": { bgcolor: "rgba(25, 118, 210, 0.08)" },
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
                }}
              >
                <ListItemIcon>
                  <AssessmentIcon sx={{ color: "#03a9f4" }} />
                </ListItemIcon>
                <ListItemText primary="Statistiques" />
              </ListItem>
            </>
          )}
        </List>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => navigate("/")}
            sx={{
              "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
            }}
          >
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Retour à l'accueil" />
          </ListItem>
        </List>
      </Paper>

      {/* Contenu principal - au milieu */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>{renderContent()}</Box>

      {/* Profil utilisateur - à droite */}
      <Paper
        sx={{
          width: 280,
          borderRadius: 0,
          boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: isTeacher ? "#ff9800" : "#1976d2",
            mb: 2,
          }}
        >
          {isTeacher ? (
            <SchoolIcon fontSize="large" />
          ) : (
            <PersonIcon fontSize="large" />
          )}
        </Avatar>

        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
        >
          {userName || "Utilisateur"}
        </Typography>

        <Typography
          variant="subtitle1"
          color="textSecondary"
          sx={{
            mb: 2,
            bgcolor: isTeacher
              ? "rgba(255, 152, 0, 0.1)"
              : "rgba(25, 118, 210, 0.1)",
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontWeight: "medium",
          }}
        >
          {isTeacher ? "Enseignant" : "Étudiant"}
        </Typography>

        <Divider sx={{ width: "100%", my: 2 }} />

        {/* Informations du profil */}
        <Box sx={{ width: "100%", mt: 2 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Dernière connexion
          </Typography>
          <Typography variant="body2" gutterBottom>
            {new Date().toLocaleDateString()}
          </Typography>

          <Typography
            variant="subtitle2"
            color="textSecondary"
            gutterBottom
            sx={{ mt: 2 }}
          >
            Email
          </Typography>
          <Typography variant="body2" gutterBottom>
            {userName
              ? `${userName.toLowerCase()}@example.com`
              : "utilisateur@example.com"}
          </Typography>

          {!isTeacher && (
            <>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
                sx={{ mt: 2 }}
              >
                Progression globale
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Box
                  sx={{ position: "relative", display: "inline-flex", mr: 2 }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={75}
                    size={40}
                    thickness={5}
                    sx={{ color: "#4CAF50" }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      color="textSecondary"
                    >
                      75%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  75% complété
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
