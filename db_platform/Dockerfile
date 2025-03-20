# Utilise une image Python officielle
FROM python:3.9-slim

# Définit le répertoire de travail
WORKDIR /app

# Copie les dépendances
COPY requirements.txt .

# Installe les dépendances
RUN pip install --no-cache-dir --timeout=120 -i https://pypi.org/simple -r requirements.txt


# Copie le reste du code
COPY . .

# Expose le port de Django
EXPOSE 8000

# Commande pour lancer le serveur
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]