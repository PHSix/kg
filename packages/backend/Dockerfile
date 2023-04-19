FROM node:latest
WORKDIR /srv/app
COPY . .
RUN pnpm install
EXPOSE 3000
CMD [\"pnpm\", \"run\", \"start\"]
