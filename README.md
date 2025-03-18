# SQL-DB-Platform
# AppSGBD - Plateforme de Gestion de Base de Données pour Éducation

## Description
AppSGBD est une application web développée pour gérer les soumissions d'exercices par des étudiants et permettre aux enseignants d'évaluer ces soumissions. Cette plateforme intègre un backend basé sur Django REST Framework et un frontend React, offrant une interface intuitive pour la soumission, l'évaluation et le téléchargement de fichiers.

## Technologies Utilisées
- **Backend** :
  - Python 3.x
  - Django 4.x
  - Django REST Framework
  - PostgreSQL (ou SQLite pour développement local)
- **Frontend** :
  - React 18.x
  - Axios (pour les requêtes HTTP)
  - Material-UI (MUI) pour les composants UI
- **Autres** :
  - Git pour la gestion de version
  - npm pour la gestion des dépendances frontend

## Structure du Projet
AppSGBD/
├── db_platform/           # Projet Django principal
│   ├── core/             # Applications personnalisées
│   │   ├── migrations/   # Migrations de la base de données
│   │   ├── models.py     # Modèles (Exercise, Submission, CustomUser, etc.)
│   │   ├── serializers.py # Sérialiseurs REST
│   │   ├── views.py      # Vues API
│   │   ├── urls.py       # Routage des URLs
│   ├── db_platform/      # Configuration du projet Django
│   │   ├── init.py   # Initialisation
│   │   ├── asgi.py       # Serveur ASGI
│   │   ├── settings.py   # Configuration
│   │   ├── urls.py       # Routage principal
│   │   ├── wsgi.py       # Serveur WSGI
│   │   └── pycache   # Fichiers générés
│   ├── manage.py         # Script de gestion Django
│   ├── db.sqlite3        # Base de données SQLite (facultatif)
│   ├── media/            # Fichiers média uploadés
│   ├── .env              # Variables d'environnement
│   ├── test_upload.py    # Script de test pour uploads
├── frontend/             # Répertoire du frontend React
│   ├── src/              # Code source React
│   │   ├── components/   # Composants (SubmissionList.js, TeacherSubmissions.js, etc.)
│   │   ├── App.js        # Composant principal
│   │   ├── index.js      # Point d'entrée
│   ├── package.json      # Dépendances et scripts npm
│   ├── README.md         # Instructions spécifiques au frontend (facultatif)
├── test/                 # Dossier pour tests ou scripts annexes
│   └── test_minio.py     # Script de test (par exemple, avec MinIO)
├── requirements.txt      # Dépendances Python
├── README.md             # Ce fichier
├── .gitignore            # Fichiers à ignorer par Git




## Prérequis
- Python 3.x installé
- Node.js et npm installés
- Un éditeur de code (par exemple, VSCode)
- (Optionnel) PostgreSQL ou une autre base de données si tu ne veux pas utiliser SQLite

## Installation et Exécution

### 1. Cloner le dépôt
git clone https://github.com/DreamerArise/SQL-DB-Platform.git 
cd AppSGBD
 2. Configurer le backend
Crée et active un environnement virtuel
```bash 
    python -m venv venv
    source venv/bin/activate  # Sur Windows : venv\Scripts\activate
    pip install -r requirements.txt
```
Configure les variables d'environnement (par exemple, dans un fichier .env) :
Crée un fichier .env dans db_platform/ avec :
```bash
    SECRET_KEY=votre_clé_secrète_django
    DEBUG=True
    DATABASE_URL=sqlite:///db.sqlite3  # Ou configure PostgreSQL
```
Appliquer les migrations
```
    cd db_platform
    python manage.py migrate
```
Crée un superutilisateur (pour tester) : 
```
python manage.py createsuperuser
```

