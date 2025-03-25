import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Divider,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress,
  Tooltip,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

function TeacherDashboard() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [correctionFile, setCorrectionFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editCorrectionFile, setEditCorrectionFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteExerciseId, setDeleteExerciseId] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [submissionCounts, setSubmissionCounts] = useState({});
  const accessToken = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  const fetchExercises = useCallback(async () => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const exercisesResponse = await axios.get(
          "https://sql-db-platform-1.onrender.com/api/teacher-exercises/",
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setExercises(exercisesResponse.data);

        // Fetch submission counts for each exercise
        const submissionCountsObj = {};
        for (const exercise of exercisesResponse.data) {
          try {
            const submissionsResponse = await axios.get(
              `https://sql-db-platform-1.onrender.com/api/exercises/${exercise.id}/submissions/`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            submissionCountsObj[exercise.id] = submissionsResponse.data.length;
          } catch (error) {
            console.error(
              `Error fetching submissions for exercise ${exercise.id}:`,
              error
            );
            submissionCountsObj[exercise.id] = 0;
          }
        }
        setSubmissionCounts(submissionCountsObj);
      } catch (error) {
        console.error("Erreur lors du chargement des exercices:", error);
        showMessageWithStatus(
          "Erreur lors du chargement des exercices.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        navigate("/login");
        return;
      }

      if (userRole !== "teacher") {
        navigate("/profile");
        return;
      }
    };

    fetchData();
    fetchExercises();
  }, [accessToken, fetchExercises, navigate, userRole]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCorrectionFileChange = (event) => {
    setCorrectionFile(event.target.files[0]);
  };

  const showMessageWithStatus = (msg, severity = "success") => {
    setMessage(msg);
    setShowMessage(true);
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !file) {
      showMessageWithStatus(
        "Veuillez remplir tous les champs requis (titre et fichier).",
        "error"
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    if (correctionFile) {
      formData.append("correction_models", correctionFile);
    }

    try {
      await axios.post(
        "https://sql-db-platform-1.onrender.com/api/exercises/add/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showMessageWithStatus("Exercice ajouté avec succès !");
      setTitle("");
      setFile(null);
      setCorrectionFile(null);
      setOpenDialog(false);
      fetchExercises();
    } catch (error) {
      showMessageWithStatus(
        "Erreur: " + (error.response?.data?.error || error.message),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exercise) => {
    setEditingExerciseId(exercise.id);
    setEditTitle(exercise.title);
    setEditFile(null);
    setEditCorrectionFile(null);
  };

  const handleEditFileChange = (event) => {
    setEditFile(event.target.files[0]);
  };

  const handleEditCorrectionFileChange = (event) => {
    setEditCorrectionFile(event.target.files[0]);
  };

  const handleSubmitEdit = async (exerciseId) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", editTitle);
    if (editFile) formData.append("file", editFile);
    if (editCorrectionFile)
      formData.append("correction_models", editCorrectionFile);

    try {
      await axios.put(
        `https://sql-db-platform-1.onrender.com/api/exercises/${exerciseId}/edit/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showMessageWithStatus("Exercice mis à jour avec succès !");
      setEditingExerciseId(null);
      setEditTitle("");
      setEditFile(null);
      setEditCorrectionFile(null);
      fetchExercises();
    } catch (error) {
      showMessageWithStatus(
        "Erreur: " + (error.response?.data?.error || error.message),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (exerciseId) => {
    setDeleteExerciseId(exerciseId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteExercise = async () => {
    if (!deleteExerciseId) return;

    setLoading(true);
    try {
      await axios.delete(
        `https://sql-db-platform-1.onrender.com/api/exercises/${deleteExerciseId}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      showMessageWithStatus("Exercice supprimé avec succès !");
      fetchExercises();
    } catch (error) {
      showMessageWithStatus(
        "Erreur lors de la suppression: " +
          (error.response?.data?.error || error.message),
        "error"
      );
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setDeleteExerciseId(null);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  // Function to format created_at date
  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  // Filter exercises based on tab
  const filteredExercises = () => {
    if (currentTab === 0) return exercises; // All exercises
    if (currentTab === 1)
      return exercises.filter((ex) => ex.has_correction_models); // With correction
    if (currentTab === 2)
      return exercises.filter((ex) => !ex.has_correction_models); // Without correction
    return exercises;
  };

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredExercises().map((exercise) => (
        <Grid item xs={12} md={6} lg={4} key={exercise.id}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardHeader
              title={
                editingExerciseId === exercise.id ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  exercise.title
                )
              }
              subheader={
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <DateRangeIcon
                    fontSize="small"
                    sx={{ mr: 0.5, color: "text.secondary", fontSize: 16 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(exercise.created_at)}
                  </Typography>
                </Box>
              }
              action={
                editingExerciseId !== exercise.id && (
                  <Box>
                    <Tooltip title="Modifier">
                      <IconButton onClick={() => handleEdit(exercise)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        onClick={() => handleDeleteConfirmation(exercise.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )
              }
            />
            <CardContent sx={{ flexGrow: 1 }}>
              {editingExerciseId === exercise.id ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Nouveau fichier PDF de l'exercice:
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadFileIcon />}
                      size="small"
                      fullWidth
                    >
                      {editFile ? editFile.name : "Choisir un fichier"}
                      <input
                        type="file"
                        onChange={handleEditFileChange}
                        accept=".pdf"
                        hidden
                      />
                    </Button>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Nouveau fichier de correction:
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadFileIcon />}
                      size="small"
                      fullWidth
                    >
                      {editCorrectionFile
                        ? editCorrectionFile.name
                        : "Choisir un fichier"}
                      <input
                        type="file"
                        onChange={handleEditCorrectionFileChange}
                        accept=".pdf"
                        hidden
                      />
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="body2" color="textSecondary">
                    {exercise.description || "Aucune description disponible"}
                  </Typography>
                  <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
                    <Chip
                      size="small"
                      label="PDF Exercice"
                      color="primary"
                      variant="outlined"
                      icon={<PlagiarismIcon />}
                    />
                    {exercise.has_correction_models ? (
                      <Chip
                        size="small"
                        label="Correction"
                        color="secondary"
                        variant="outlined"
                        icon={<VisibilityIcon />}
                      />
                    ) : (
                      <Chip
                        size="small"
                        label="Sans correction"
                        color="default"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </>
              )}
            </CardContent>
            <CardActions>
              {editingExerciseId === exercise.id ? (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmitEdit(exercise.id)}
                  >
                    Enregistrer
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setEditingExerciseId(null)}
                  >
                    Annuler
                  </Button>
                </>
              ) : (
                <>
                  <Badge
                    badgeContent={submissionCounts[exercise.id] || 0}
                    color="primary"
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      component={Link}
                      to={`/teacher-dashboard/submissions/${exercise.id}`}
                      startIcon={<AssignmentTurnedInIcon />}
                    >
                      Consulter soumissions
                    </Button>
                  </Badge>
                </>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <List component={Paper} elevation={2} sx={{ width: "100%" }}>
      {filteredExercises().map((exercise) => (
        <React.Fragment key={exercise.id}>
          <ListItem
            secondaryAction={
              editingExerciseId !== exercise.id && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Modifier">
                    <IconButton onClick={() => handleEdit(exercise)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton
                      onClick={() => handleDeleteConfirmation(exercise.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Badge
                    badgeContent={submissionCounts[exercise.id] || 0}
                    color="primary"
                    sx={{ ml: 1 }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      component={Link}
                      to={`/teacher-dashboard/submissions/${exercise.id}`}
                      startIcon={<AssignmentTurnedInIcon />}
                      size="small"
                    >
                      Soumissions
                    </Button>
                  </Badge>
                </Box>
              )
            }
          >
            <ListItemText
              primary={
                editingExerciseId === exercise.id ? (
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  <Typography variant="subtitle1" fontWeight="medium">
                    {exercise.title}
                  </Typography>
                )
              }
              secondary={
                <>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <DateRangeIcon
                      fontSize="small"
                      sx={{ mr: 0.5, color: "text.secondary", fontSize: 16 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(exercise.created_at)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", mt: 1, gap: 1 }}>
                    <Chip
                      size="small"
                      label="PDF Exercice"
                      color="primary"
                      variant="outlined"
                      icon={<PlagiarismIcon />}
                    />
                    {exercise.has_correction_models ? (
                      <Chip
                        size="small"
                        label="Correction"
                        color="secondary"
                        variant="outlined"
                        icon={<VisibilityIcon />}
                      />
                    ) : (
                      <Chip
                        size="small"
                        label="Sans correction"
                        color="default"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </>
              }
            />
          </ListItem>

          {editingExerciseId === exercise.id && (
            <ListItem>
              <Box sx={{ width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Nouveau fichier PDF de l'exercice:
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadFileIcon />}
                      size="small"
                      fullWidth
                    >
                      {editFile ? editFile.name : "Choisir un fichier"}
                      <input
                        type="file"
                        onChange={handleEditFileChange}
                        accept=".pdf"
                        hidden
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Nouveau fichier de correction:
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadFileIcon />}
                      size="small"
                      fullWidth
                    >
                      {editCorrectionFile
                        ? editCorrectionFile.name
                        : "Choisir un fichier"}
                      <input
                        type="file"
                        onChange={handleEditCorrectionFileChange}
                        accept=".pdf"
                        hidden
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmitEdit(exercise.id)}
                      >
                        Enregistrer
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setEditingExerciseId(null)}
                      >
                        Annuler
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </ListItem>
          )}
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolIcon sx={{ fontSize: 32, mr: 2, color: "primary.main" }} />
            <Typography variant="h4" component="h1">
              Tableau de bord enseignant
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Nouvel exercice
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="exercise tabs"
          >
            <Tab
              label="Tous les exercices"
              icon={<FormatListBulletedIcon />}
              iconPosition="start"
            />
            <Tab
              label="Avec correction"
              icon={<VisibilityIcon />}
              iconPosition="start"
            />
            <Tab
              label="Sans correction"
              icon={<PlagiarismIcon />}
              iconPosition="start"
            />
          </Tabs>

          <Box>
            <Tooltip title={viewMode === "grid" ? "Vue liste" : "Vue grille"}>
              <IconButton onClick={toggleViewMode} color="primary">
                {viewMode === "grid" ? (
                  <FormatListBulletedIcon />
                ) : (
                  <GridViewIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Filtrer">
              <IconButton color="primary">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {exercises.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 5,
            }}
          >
            <AssignmentIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Aucun exercice disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Commencez par ajouter votre premier exercice
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Ajouter un exercice
            </Button>
          </Box>
        ) : viewMode === "grid" ? (
          renderGridView()
        ) : (
          renderListView()
        )}
      </Paper>

      {/* Dialog for adding new exercise */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">Ajouter un nouvel exercice</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Titre de l'exercice"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Fichier PDF de l'exercice*
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                fullWidth
                sx={{ height: "56px" }}
              >
                {file ? file.name : "Choisir un fichier PDF"}
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf"
                  hidden
                />
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Fichier PDF de correction (facultatif)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                fullWidth
                sx={{ height: "56px" }}
              >
                {correctionFile
                  ? correctionFile.name
                  : "Choisir un fichier PDF"}
                <input
                  type="file"
                  onChange={handleCorrectionFileChange}
                  accept=".pdf"
                  hidden
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Ajouter l'exercice
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for delete confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cet exercice ? Cette action est
            irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteExercise}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseMessage}
          severity={message.includes("Erreur") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default TeacherDashboard;
