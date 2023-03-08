# Specify the base image
FROM node:14-alpine

# Create a directory for the app
WORKDIR /app/react-server

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port on which the app will run
EXPOSE 8000

VOLUME ["/app/react-server/data"]

# Start the Node.js server
CMD ["npm","run","dev"]