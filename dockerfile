FROM node:alpine3.18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5000
RUN npm run build
CMD [ "npm","run","start" ]
