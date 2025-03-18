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
            "Tu es un enseignant chargé d'évaluer une soumission d'étudiant par rapport à une correction modèle. "
            "Voici le texte de la soumission :\n\n"
            f"{submission_text}\n\n"
            "Et voici la correction modèle :\n\n"
            f"{correction_text}\n\n"
            "Compare la soumission à la correction et attribue une note sur 20. Fournis également un feedback détaillé expliquant la note. Réponds au format : 'Note: X/20\nFeedback: ...'"
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