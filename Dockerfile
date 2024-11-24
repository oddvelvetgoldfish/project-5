# Stage 1: Build the frontend
FROM node:18 as build-frontend
WORKDIR /frontend

# Copy frontend package.json and package-lock.json
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Build the backend
FROM node:18 as build-backend
WORKDIR /backend

# Copy backend package.json and package-lock.json
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Expose the app port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "dev"]
