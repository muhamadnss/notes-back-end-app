FROM node:16-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json ./

RUN npm install

EXPOSE 8000

CMD ["npm", "start", "run"]
