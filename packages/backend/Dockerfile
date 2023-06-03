FROM node:latest
WORKDIR /srv/app
COPY . .
RUN npm install yarn
RUN yarn
EXPOSE 3001
RUN yarn dev
