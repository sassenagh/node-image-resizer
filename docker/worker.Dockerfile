FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /usr/src/app

COPY package*.json ./

RUN chown -R appuser:appgroup /usr/src/app

USER appuser

RUN npm install --omit=dev

COPY --chown=appuser:appgroup worker/ ./worker
COPY --chown=appuser:appgroup api/services/ ./api/services

CMD ["node", "worker/worker.js"]