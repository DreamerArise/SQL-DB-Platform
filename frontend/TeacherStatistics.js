import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const TeacherStatistics = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/teacher-statistics/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatistics(response.data);
        setError(null);
      } catch (err) {
        setError(
          "Erreur lors de la récupération des statistiques : " + err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Transformer les données pour le tableau et le graphique
  const rows = Object.keys(statistics).map((exerciseId) => ({
    id: exerciseId,
    exerciseId,
    submissionCount: statistics[exerciseId].submission_count,
    averageScore: statistics[exerciseId].average_score.toFixed(2),
  }));

  const chartData = rows.map((row) => ({
    exerciseId: row.exerciseId,
    averageScore: parseFloat(row.averageScore),
    submissionCount: row.submissionCount,
  }));

  // Colonnes du tableau
  const columns = [
    { field: "exerciseId", headerName: "📖 Exercice", width: 150 },
    {
      field: "submissionCount",
      headerName: "📌 Nombre de Soumissions",
      width: 200,
    },
    { field: "averageScore", headerName: "⭐ Score Moyen", width: 180 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              color: "#1976d2",
              mb: 3,
            }}
          >
            📊 Statistiques des Exercices
          </Typography>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress color="primary" />
            </div>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : rows.length === 0 ? (
            <Alert severity="info">Aucune statistique disponible.</Alert>
          ) : (
            <>
              {/* Tableau interactif */}
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                📌 Détails des performances
              </Typography>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  disableSelectionOnClick
                />
              </div>

              {/* Graphique */}
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                📊 Visualisation des Scores
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="exerciseId"
                    label={{
                      value: "ID Exercice",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Valeurs",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="averageScore"
                    fill="#8884d8"
                    name="Score Moyen"
                  />
                  <Bar
                    dataKey="submissionCount"
                    fill="#82ca9d"
                    name="Nombre de Soumissions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default TeacherStatistics;
