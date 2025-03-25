import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

const TeacherSubmissions = () => {
  const { exerciseId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [exerciseTitle, setExerciseTitle] = useState("");
  const [adjustingSubmissionId, setAdjustingSubmissionId] = useState(null);
  const [newScore, setNewScore] = useState("");
  const [newFeedback, setNewFeedback] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!accessToken) {
      setError("Aucun token d'accès trouvé. Veuillez vous connecter.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Récupérer les détails de l'exercice
        const exerciseResponse = await axios.get(
          `http://127.0.0.1:8000/api/exercises/${exerciseId}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setExerciseTitle(
          exerciseResponse.data.title || `Exercice ${exerciseId}`
        );

        // Récupérer les soumissions
        const submissionsResponse = await axios.get(
          `http://127.0.0.1:8000/api/exercises/${exerciseId}/submissions/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setSubmissions(submissionsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError(
          "Échec du chargement des soumissions ou des détails de l'exercice. Vérifiez vos permissions ou la connexion."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [exerciseId, accessToken]);

  const handleAdjust = (submissionId, currentScore, currentFeedback) => {
    setAdjustingSubmissionId(submissionId);
    setNewScore(currentScore || "");
    setNewFeedback(currentFeedback || "");
    setError("");
    setSuccess("");
  };

  const handleSubmitAdjust = async (submissionId) => {
    if (!newScore || newScore < 0 || newScore > 20) {
      setError("Veuillez entrer une note valide entre 0 et 20.");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/submissions/${submissionId}/adjust/`,
        { score: parseInt(newScore), feedback: newFeedback },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const response = await axios.get(
        `http://127.0.0.1:8000/api/exercises/${exerciseId}/submissions/`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSubmissions(response.data);
      setAdjustingSubmissionId(null);
      setNewScore("");
      setNewFeedback("");
      setSuccess("Note et feedback mis à jour avec succès !");
      setError("");
    } catch (error) {
      console.error("Erreur lors de l'ajustement:", error);
      setError("Erreur lors de la mise à jour de la soumission.");
      setSuccess("");
    }
  };

  const getScoreColor = (score) => {
    if (score === undefined) return "default";
    return score > 10 ? "success" : "error";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Soumissions pour l'exercice : {exerciseTitle}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {submissions.length === 0 && !error && (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="subtitle1">
                Aucune soumission trouvée.
              </Typography>
            </Paper>
          )}

          <Grid container spacing={3}>
            {submissions.map((submission, index) => (
              <Grid item xs={12} key={submission.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderLeft: "4px solid #1976d2",
                    transition: "box-shadow 0.3s",
                    "&:hover": { boxShadow: 3 },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#1976d2", fontWeight: "bold" }}
                    >
                      Étudiant :{" "}
                      {submission.student &&
                      typeof submission.student === "object" &&
                      submission.student.username
                        ? submission.student.username
                        : "Inconnu"}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Date de soumission
                        </Typography>
                        <Typography variant="body1">
                          {submission.submitted_at
                            ? new Date(submission.submitted_at).toLocaleString()
                            : "Non spécifiée"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Score
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={
                              submission.score !== undefined
                                ? `${submission.score}/20`
                                : "Non évalué"
                            }
                            color={getScoreColor(submission.score)}
                            variant="outlined"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Feedback
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2,
                            mt: 1,
                            minHeight: "60px",
                            bgcolor: "#f5f5f5",
                            borderRadius: 1,
                          }}
                        >
                          <Typography>
                            {submission.feedback || "Aucun feedback"}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    {adjustingSubmissionId === submission.id ? (
                      <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Nouvelle note"
                              type="number"
                              fullWidth
                              value={newScore}
                              onChange={(e) => setNewScore(e.target.value)}
                              inputProps={{ min: 0, max: 20 }}
                              variant="outlined"
                              sx={{ mb: 2 }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              label="Nouveau feedback"
                              multiline
                              rows={3}
                              fullWidth
                              value={newFeedback}
                              onChange={(e) => setNewFeedback(e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={() => handleSubmitAdjust(submission.id)}
                          >
                            Enregistrer
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={() => setAdjustingSubmissionId(null)}
                          >
                            Annuler
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <CardActions sx={{ justifyContent: "flex-end", pt: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() =>
                            handleAdjust(
                              submission.id,
                              submission.score,
                              submission.feedback
                            )
                          }
                        >
                          Ajuster la note
                        </Button>
                        {submission.file && (
                          <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            href={submission.file}
                            download
                          >
                            Télécharger
                          </Button>
                        )}
                      </CardActions>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default TeacherSubmissions;
