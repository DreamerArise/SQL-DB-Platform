import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StudentPerformance = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("/api/student-performance/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError(
          "Erreur lors de la récupération des performances : " + err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Préparer les données pour le graphique
  const chartData = submissions
    .map((sub) => ({
      date: new Date(sub.submitted_at).toLocaleDateString(),
      score: sub.score ?? 0, // Remplace N/A par 0 pour le graphique
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Trier par date

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
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
            📊 Mes Performances
          </Typography>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "150px",
              }}
            >
              <CircularProgress color="primary" />
            </div>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : submissions.length === 0 ? (
            <Alert severity="info">Aucune soumission disponible.</Alert>
          ) : (
            <>
              {/* Graphique d'évolution */}
              <Typography
                variant="h6"
                sx={{ mt: 3, mb: 2, textAlign: "center" }}
              >
                📈 Évolution des Performances
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#1976d2"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Tableau des performances */}
              <Typography
                variant="h6"
                sx={{ mt: 4, mb: 2, textAlign: "center" }}
              >
                📌 Détails des Soumissions
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "#1976d2" }}>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        📅 Date
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        📖 Exercice
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        ⭐ Score
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submissions.map((sub) => (
                      <TableRow key={sub.id} hover>
                        <TableCell>
                          {new Date(sub.submitted_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{sub.exercise}</TableCell>
                        <TableCell>{sub.score ?? "N/A"} / 20</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default StudentPerformance;
