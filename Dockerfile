# Dockerfile

FROM node:18

WORKDIR /app



COPY package*.json ./
RUN npm install

COPY . .

# Копируем скрипт ожидания


# Указываем команду запуска через скрипт ожидания
CMD [ "npm", "start"]