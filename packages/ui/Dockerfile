FROM node:latest
WORKDIR /srv/app
COPY package*.json ./
RUN npm install pnpm -g
RUN pnpm install
COPY . .
EXPOSE 5173
RUN pnpm run dev
# CMD [\"npm\", \"run\", \"start\"]
