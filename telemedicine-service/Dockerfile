FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port 3004 (telemedicine-service)
EXPOSE 4000

# Start the Node application
CMD ["node", "server.js"]
