FROM node:12-alpine3.13
WORKDIR /app
COPY package*json ./
RUN npm i
COPY . ./
EXPOSE 1337
CMD ["node", "server.js"]