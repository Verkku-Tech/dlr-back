################################################# Build stage
FROM node:22-slim AS build

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

################################################# Production stage
FROM node:22-slim

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

RUN rm package*.json

# Expose the port
EXPOSE 3000

# Start the development server with hot reloading
CMD ["node", "dist/main"]
