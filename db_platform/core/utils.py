# core/utils.py
import logging
import requests
from PyPDF2 import PdfReader

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path):
    try:
        pdf = PdfReader(file_path)
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        return f"Erreur lors de l'extraction du texte : {str(e)}"

def evaluate_with_deepseek(submission_text, correction_text):
    try:
        url = "http://localhost:11434/api/generate"
        prompt = (
    "Tu es un enseignant expert en évaluation de travaux étudiants. Ta tâche est de comparer une soumission d'étudiant à une correction modèle et d'attribuer une note sur 20, accompagnée d'un feedback détaillé.\n\n"
    "**Consignes:**\n\n"
    "1.  **Analyse comparative:**\n"
    "    * Compare attentivement les requêtes de la soumission de l'étudiant avec celles de la correction modèle.\n"
    "    * Identifie les similitudes, les différences, les erreurs et les omissions.\n"
    "    * Évalue la qualité et la pertinence des requêtes de l'étudiant par rapport à la correction modèle.\n\n"
    "2.  **Attribution de la note:**\n"
    "    * Attribue une note sur 20 en fonction de la qualité globale de la soumission de l'étudiant.\n"
    "    * Tiens compte de la précision, de la complétude et de la pertinence des requêtes.\n\n"
    "3.  **Feedback détaillé:**\n"
    "    * Fournis un feedback clair et constructif expliquant la note attribuée.\n"
    "    * Souligne les points forts et les points faibles de la soumission de l'étudiant.\n"
    "    * Donne des suggestions d'amélioration et des pistes de réflexion.\n\n"
    "**Format de la réponse:**\n\n"
    "Utilise le format suivant :\n\n"
    "```\n"
    "Note: [Note]/20\n"
    "Feedback: [Feedback détaillé]\n"
    "```\n\n"
    "**Soumission de l'étudiant:**\n\n"
    "```\n"
    "[Texte de la soumission de l'étudiant]\n"
    "```\n\n"
    "**Correction modèle:**\n\n"
    "```\n"
    "[Texte de la correction modèle]\n"
    "```\n\n"
    "**Informations complémentaires :**\n\n"
    "* Sois précis et concis dans ton analyse et ton feedback.\n"
    "* Utilise un langage clair et adapté au niveau de l'étudiant.\n"
    "* soyez rigoureux sur les fautes d'orthographes de l'étudiant.\n"
    "* Si la réponse de l'étudiant est hors sujet par rapport à la réponse modèle, veuillez le préciser.\n\n"
    "Merci de ton aide."
)

        headers = {"Content-Type": "application/json"}
        data = {"model": "deepseek-coder", "prompt": prompt, "stream": False}

        logger.debug(f"Envoi de la requête à {url} avec prompt : {prompt[:100]}...")  # Limite pour lisibilité
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        logger.debug(f"Réponse brute : {response.text}")

        result = response.json()
        generated_text = result.get("response", "")
        logger.debug(f"Texte généré : {generated_text}")

        if not generated_text:
            return 0, "Erreur : Aucune réponse générée par DeepSeek."

        lines = generated_text.strip().split('\n')
        if len(lines) < 2:
            return 0, f"Erreur : Réponse mal formatée, pas assez de lignes : {generated_text}"

        note_line = lines[0]
        feedback = '\n'.join(lines[1:])

        # Vérifie le format de la note
        if not note_line.startswith("Note: ") or "/" not in note_line:
            return 0, f"Erreur : Format de note invalide : {note_line}"

        try:
            score = int(note_line.split(": ")[1].split("/")[0])
        except (IndexError, ValueError):
            return 0, f"Erreur : Impossible d'extraire la note : {note_line}"

        feedback = feedback.replace("Feedback: ", "").strip()
        if not feedback:
            feedback = "Aucun feedback fourni par DeepSeek."

        return score, feedback

    except Exception as e:
        logger.error(f"Erreur lors de l'évaluation : {str(e)}")
        return 0, f"Erreur lors de l'évaluation avec DeepSeek via ollama : {str(e)}"