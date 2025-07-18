# Use the official Node.js 20 (LTS) image as the base
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
# This step is optimized for Docker caching
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (matching your server.js)
EXPOSE 3000

# Command to run the application
CMD [ "node", "server.js" ]