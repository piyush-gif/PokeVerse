# Use a light Node image
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run Vite and tell it to accept external connections (0.0.0.0)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]