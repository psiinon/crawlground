FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY lib ./lib
COPY views ./views
COPY public ./public
COPY tests ./tests
COPY server.js ./

RUN mkdir -p /app/data && chown -R node:node /app

USER node

ENV PORT=3456
EXPOSE 3456

VOLUME ["/app/data"]

CMD ["node", "server.js"]
