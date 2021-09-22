FROM node:12-alpine3.13
WORKDIR /app
COPY package*json ./
RUN npm i
COPY . ./
ENV port=1337
EXPOSE $port
CMD ["node", "server.js"]