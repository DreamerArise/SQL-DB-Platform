# Utilise une image Node officielle
FROM node:18-alpine AS build

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Build l'application React
RUN npm run build

# Utilise une image Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copie les fichiers buildés dans Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose le port de Nginx
EXPOSE 80

# Commande pour lancer Nginx
CMD ["nginx", "-g", "daemon off;"]