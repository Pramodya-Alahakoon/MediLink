FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose the correct port defined in server.js
EXPOSE 3003

# Start the Node application
CMD ["node", "server.js"]
