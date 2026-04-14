FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the React/Vite app for production
RUN npm run build

# Expose port
EXPOSE 5173

# Serve the built static files without prompting
CMD ["npx", "-y", "serve", "-s", "dist", "-l", "5173"]
