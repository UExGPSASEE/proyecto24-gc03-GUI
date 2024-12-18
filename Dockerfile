# Usar una imagen base de Node.js
FROM node:18-alpine

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

# Establecer las variables de entorno para desarrollo
ENV NODE_ENV=development

# Exponer el puerto en el que Next.js correrá
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev", "--prefix", "project"]
