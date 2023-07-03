FROM node:latest
WORKDIR /srv/app
COPY . .
RUN npm install pnpm -g
RUN pnpm install
EXPOSE 5173
RUN ls
CMD cd packages/ui/ && pnpm run dev
# CMD ["pnpm", "run", "dev"]
# RUN pnpm run dev
# CMD [\"npm\", \"run\", \"start\"]
