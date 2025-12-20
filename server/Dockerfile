FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production

# App Runner will route traffic to this port via PORT env var,
# but EXPOSE is still nice to document.
EXPOSE 4000

# Start your server entry
CMD ["node", "src/index.js"]
