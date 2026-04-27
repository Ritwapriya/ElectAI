# Build stage for Frontend
FROM node:18-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Final stage for Backend + serving Frontend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy built frontend to backend public folder
COPY --from=frontend-build /app/frontend/build ./public

EXPOSE 5000
CMD ["node", "server.js"]
