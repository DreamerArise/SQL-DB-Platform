import React, { useState, useEffect } from "react";
import axios from "axios";

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [status, setStatus] = useState({ message: "", isError: false });
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/submissions/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            timeout: 10000, // Timeout de 10 secondes pour éviter les erreurs de connexion prolongées
          }
        );
        setSubmissions(response.data);
        setStatus({ message: "", isError: false });
      } catch (error) {
        console.error("Erreur lors du chargement des soumissions:", error);
        setStatus({
          message:
            "Échec du chargement des soumissions. Vérifiez votre connexion ou essayez à nouveau plus tard.",
          isError: true,
        });
      }
    };

    if (!accessToken) {
      setStatus({
        message: "Aucun token d'accès trouvé. Veuillez vous connecter.",
        isError: true,
      });
      return;
    }

    fetchSubmissions();
  }, [accessToken]);

  const updateSubmission = async (submissionId) => {
    if (!newFile) {
      setStatus({
        message: "Veuillez sélectionner un fichier.",
        isError: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", newFile);

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/submissions/${submissionId}/edit/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000, // Timeout de 10 secondes ici aussi
        }
      );

      setSubmissions(
        submissions.map((sub) =>
          sub.id === submissionId ? response.data : sub
        )
      );
      resetEditState();
      setStatus({
        message: "Soumission mise à jour avec succès !",
        isError: false,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setStatus({
        message: "Erreur lors de la mise à jour de la soumission.",
        isError: true,
      });
    }
  };

  const resetEditState = () => {
    setEditingId(null);
    setNewFile(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderEditControls = (submission) => {
    const isEditing = editingId === submission.id;

    if (submission.is_locked) {
      return <span className="locked-badge">Verrouillée</span>;
    }

    return isEditing ? (
      <div className="edit-controls">
        <input
          type="file"
          onChange={(e) => setNewFile(e.target.files[0])}
          className="file-input"
        />
        <div className="button-group">
          <button
            onClick={() => updateSubmission(submission.id)}
            className="save-button"
          >
            Enregistrer
          </button>
          <button onClick={resetEditState} className="cancel-button">
            Annuler
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={() => setEditingId(submission.id)}
        className="edit-button"
      >
        Modifier
      </button>
    );
  };

  return (
    <div className="submissions-container">
      <h2 className="section-title">Mes soumissions</h2>

      {status.message && (
        <div
          className={`status-message ${status.isError ? "error" : "success"}`}
        >
          {status.message}
        </div>
      )}

      {submissions.length === 0 && !status.isError && (
        <div className="empty-state">Aucune soumission trouvée.</div>
      )}

      <div className="submissions-list">
        {submissions.map((submission) => (
          <div key={submission.id} className="submission-card">
            <div className="submission-header">
              <h3>{submission.exercise_title || "Exercice non spécifié"}</h3>
              {submission.score !== undefined && (
                <span
                  className={`score-badge ${
                    submission.score >= 10 ? "passing" : "failing"
                  }`}
                >
                  {submission.score}/20
                </span>
              )}
            </div>

            <div className="submission-details">
              <div className="detail-item">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {formatDate(submission.submitted_at)}
                </span>
              </div>

              {submission.feedback && (
                <div className="detail-item feedback">
                  <span className="detail-label">Feedback:</span>
                  <span className="detail-value">{submission.feedback}</span>
                </div>
              )}
            </div>

            <div className="submission-actions">
              {renderEditControls(submission)}

              {submission.file && (
                <a href={submission.file} download className="download-link">
                  Télécharger
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .submissions-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .section-title {
          font-size: 24px;
          color: blue;
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 10px;
        }

        .status-message {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .error {
          background-color: #ffebee;
          color: #c62828;
          border-left: 4px solid #c62828;
        }

        .success {
          background-color: #e8f5e9;
          color: #2e7d32;
          border-left: 4px solid #2e7d32;
        }

        .empty-state {
          text-align: center;
          padding: 40px 0;
          color: #757575;
          font-style: italic;
        }

        .submissions-list {
          display: grid;
          gap: 20px;
        }

        .submission-card {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
          background: white;
        }

        .submission-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .submission-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .submission-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .score-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 14px;
        }

        .passing {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .failing {
          background-color: #ffebee;
          color: #c62828;
        }

        .locked-badge {
          background-color: #f5f5f5;
          color: #757575;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
        }

        .submission-details {
          margin-bottom: 16px;
        }

        .detail-item {
          margin-bottom: 8px;
        }

        .detail-label {
          font-weight: 500;
          color: #757575;
          margin-right: 8px;
        }

        .detail-value {
          color: #333;
        }

        .feedback {
          display: flex;
          flex-direction: column;
        }

        .feedback .detail-value {
          margin-top: 4px;
          padding: 8px;
          background-color: #f9f9f9;
          border-radius: 4px;
          font-style: italic;
        }

        .submission-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }

        button {
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: background-color 0.2s;
        }

        .edit-button {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        .edit-button:hover {
          background-color: #bbdefb;
        }

        .save-button {
          background-color: #e8f5e9;
          color: #2e7d32;
          margin-right: 8px;
        }

        .save-button:hover {
          background-color: #c8e6c9;
        }

        .cancel-button {
          background-color: #f5f5f5;
          color: #757575;
        }

        .cancel-button:hover {
          background-color: #e0e0e0;
        }

        .download-link {
          color: #1976d2;
          text-decoration: none;
          font-weight: 500;
          padding: 8px 12px;
          border-radius: 4px;
          background-color: #e3f2fd;
          transition: background-color 0.2s;
        }

        .download-link:hover {
          background-color: #bbdefb;
          text-decoration: none;
        }

        .file-input {
          margin-bottom: 12px;
          width: 100%;
        }

        .edit-controls {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .button-group {
          display: flex;
        }

        @media (max-width: 600px) {
          .submission-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .score-badge {
            margin-top: 8px;
          }

          .submission-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .download-link {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmissionList;
