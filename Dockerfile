# Stage 1: Build the backend
FROM node:18 as build-backend
WORKDIR /backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Stage 2: Build the frontend
FROM node:18 as build-frontend
WORKDIR /frontend

# Copy all frontend files
COPY frontend/ ./

# Install frontend dependencies and build the frontend
RUN npm install
RUN npm run build

# Stage 3: Final container
FROM node:18 as production
WORKDIR /backend

# Copy built backend from Stage 1
COPY --from=build-backend /backend ./

# Copy built frontend from Stage 2 into backend's client directory
COPY --from=build-frontend /backend/client ./client

# Expose the app port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "dev"]
