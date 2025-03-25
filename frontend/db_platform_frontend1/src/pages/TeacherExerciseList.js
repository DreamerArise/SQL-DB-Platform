import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherExerciseList = () => {
  const [exercises, setExercises] = useState([]);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCorrectionFile, setNewCorrectionFile] = useState(null);

  // Charger les exercices
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/teacher-exercises/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setExercises(response.data))
      .catch((error) =>
        console.error("Erreur lors du chargement des exercices:", error)
      );
  }, []);

  // Gérer la modification
  const handleEdit = (exercise) => {
    setEditingExerciseId(exercise.id);
    setNewName(exercise.name);
    setNewDescription(exercise.description);
  };

  const handleFileChange = (e) => {
    setNewCorrectionFile(e.target.files[0]);
  };

  const handleSubmitEdit = (exerciseId) => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("description", newDescription);
    if (newCorrectionFile) {
      formData.append("correction_models", newCorrectionFile);
    }

    axios
      .put(
        `http://127.0.0.1:8000/api/exercises/${exerciseId}/edit/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setExercises(
          exercises.map((ex) => (ex.id === exerciseId ? response.data : ex))
        );
        setEditingExerciseId(null);
        setNewName("");
        setNewDescription("");
        setNewCorrectionFile(null);
        alert("Exercice mis à jour avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour:", error);
        alert("Erreur lors de la mise à jour de l’exercice.");
      });
  };

  return (
    <div>
      <h2>Mes exercices</h2>
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <p>Nom : {exercise.name}</p>
          <p>Description : {exercise.description}</p>
          {editingExerciseId === exercise.id ? (
            <div>
              <label>Nom : </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <br />
              <label>Description : </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <br />
              <label>Nouveau fichier de correction : </label>
              <input type="file" onChange={handleFileChange} />
              <br />
              <button onClick={() => handleSubmitEdit(exercise.id)}>
                Enregistrer
              </button>
              <button onClick={() => setEditingExerciseId(null)}>
                Annuler
              </button>
            </div>
          ) : (
            <button onClick={() => handleEdit(exercise)}>Modifier</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeacherExerciseList;
