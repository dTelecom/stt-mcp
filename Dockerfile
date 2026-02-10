FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build
ENTRYPOINT ["node", "build/index.js"]
