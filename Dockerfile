# Use Node.js 20 (required for better-sqlite3)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove build dependencies to reduce image size
RUN apk del python3 make g++

# Expose port
EXPOSE 10000

# Start the application
CMD ["npm", "start"]
