FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port 5005 (notification-service)
EXPOSE 5005

# Start the Node application
CMD ["node", "server.js"]
