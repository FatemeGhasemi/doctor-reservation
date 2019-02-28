FROM node:10-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY src ./src

COPY .env.docker ./

RUN npm install

RUN ls

