import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Book as BookIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchExercises = async () => {
      try {
        const [exercisesRes, userRes] = await Promise.all([
          axios.get("https://sql-db-platform-1.onrender.com/api/exercises/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get("https://sql-db-platform-1.onrender.com/api/user/", {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        const isTeacher = userRes.data.is_teacher;
        setExercises(
          exercisesRes.data.map((exercise) => ({
            ...exercise,
            showCorrection: isTeacher && exercise.correction_models,
          }))
        );
      } catch (error) {
        console.error("Erreur lors de la récupération des exercices:", error);
      }
    };
    fetchExercises();
  }, [accessToken, navigate]);

  const handleDownload = (url) => {
    const fullUrl = url.startsWith("http")
      ? url
      : `https://sql-db-platform-1.onrender.com${url}`;
    const link = document.createElement("a");
    link.href = fullUrl;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 700, mb: 4, display: "flex", alignItems: "center" }}
      >
        <BookIcon sx={{ mr: 1, color: "primary.main" }} /> Liste des exercices
      </Typography>

      {exercises.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#f9f9f9",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Aucun exercice disponible pour le moment.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {exercises.map((exercise) => (
            <Grid item xs={12} key={exercise.id}>
              <Card
                elevation={4}
                sx={{
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: 8 },
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 600 }}
                  >
                    {exercise.title}
                  </Typography>
                  {exercise.description && (
                    <Typography color="textSecondary" sx={{ mt: 1 }}>
                      {exercise.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions
                  sx={{ p: 2, pt: 0, display: "flex", alignItems: "center" }}
                >
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(exercise.file)}
                    disabled={!exercise.file}
                    sx={{ borderRadius: 2 }}
                  >
                    Télécharger
                  </Button>

                  {exercise.showCorrection && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(exercise.correction_models)}
                      sx={{ ml: 2, borderRadius: 2 }}
                    >
                      Correction
                    </Button>
                  )}

                  {exercise.tags && exercise.tags.length > 0 && (
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {exercise.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            ml: 0.5,
                            bgcolor: "primary.light",
                            color: "white",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default ExerciseList;
