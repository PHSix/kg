FROM node:latest
WORKDIR /srv/app
COPY . .
RUN npm install pnpm
RUN pnpm install
EXPOSE 3001
RUN pnpm run start
