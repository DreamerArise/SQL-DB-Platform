import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Alert,
  FormControl,
  MenuItem,
  CircularProgress,
  Fade,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Styled components
const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  backgroundColor: theme.palette.grey[50],
  transition: "all 0.3s ease",
  borderRadius: theme.shape.borderRadius,
  border: `2px dashed ${theme.palette.primary.light}`,
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[3],
  },
}));

const HiddenInput = styled("input")({
  display: "none",
});

const FileChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  height: "auto",
}));

function SubmissionForm() {
  const [exerciseId, setExerciseId] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://sql-db-platform-1.onrender.com/api/exercises/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setExercises(response.data);
      } catch (error) {
        setError("Impossible de récupérer les exercices. Veuillez réessayer.");
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!exerciseId) {
      setError("Veuillez sélectionner un exercice.");
      return;
    }

    if (!file) {
      setError("Veuillez sélectionner un fichier PDF à soumettre.");
      return;
    }

    const formData = new FormData();
    formData.append("exercise", exerciseId);
    formData.append("file", file);

    try {
      setSubmitting(true);
      await axios.post(
        "https://sql-db-platform-1.onrender.com/api/submit/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(true);
      setTimeout(() => navigate("/submissions"), 1500);
    } catch (error) {
      setError(error.response?.data?.error || "Erreur lors de la soumission.");
      console.error("Erreur:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Veuillez sélectionner un fichier PDF valide.");
    }
  };

  const openFileSelector = () => {
    document.getElementById("file-input").click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Veuillez déposer un fichier PDF valide.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Soumettre Votre Travail
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Sélectionnez un exercice et téléversez votre fichier PDF
        </Typography>

        <form onSubmit={handleSubmit}>
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <TextField
                select
                label="Exercice"
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                variant="outlined"
                disabled={loading}
                InputProps={{
                  endAdornment: loading && <CircularProgress size={20} />,
                }}
              >
                <MenuItem value="" disabled>
                  <em>Sélectionner un exercice</em>
                </MenuItem>
                {exercises.map((exercise) => (
                  <MenuItem key={exercise.id} value={exercise.id}>
                    {exercise.title}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <Box sx={{ mb: 3 }}>
              <UploadBox
                onClick={openFileSelector}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <HiddenInput
                  id="file-input"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                />

                {file ? (
                  <>
                    <UploadFileIcon
                      color="success"
                      sx={{ fontSize: 48, mb: 1 }}
                    />
                    <FileChip
                      label={file.name}
                      variant="outlined"
                      color="primary"
                      icon={<CloudUploadIcon />}
                      onDelete={() => setFile(null)}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Cliquez pour changer de fichier
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudUploadIcon
                      color="primary"
                      sx={{ fontSize: 48, mb: 1 }}
                    />
                    <Typography variant="body1" gutterBottom>
                      Glissez-déposez votre fichier PDF ici
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ou cliquez pour parcourir vos fichiers
                    </Typography>
                  </>
                )}
              </UploadBox>
            </Box>

            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {success && (
              <Fade in={success}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Soumission réussie! Redirection en cours...
                </Alert>
              </Fade>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={submitting || !file || !exerciseId}
              startIcon={
                submitting ? <CircularProgress size={20} /> : <SendIcon />
              }
              sx={{
                borderRadius: 2,
                py: 1.2,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              {submitting ? "Soumission en cours..." : "Soumettre le travail"}
            </Button>
          </Paper>
        </form>
      </Box>
    </Container>
  );
}

export default SubmissionForm;
