# Usar una imagen base de Node.js
FROM node:18-alpine

# Metadatos de la imagen
LABEL version="1.0"
LABEL project="GUI"
LABEL maintainer="dtorrescb@alumnos.unex.es"
LABEL description="Imagen de Docker para la aplicación React GUI"
LABEL date="14/12/2024"

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar y instalar las dependencias del package.json en la raíz
COPY package*.json ./
RUN npm install

# Copiar y instalar las dependencias del package.json en ./project
COPY project/package*.json ./project/
RUN cd project && npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto en el que Next.js correrá
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev", "--prefix", "project"]