# Start with a base image (Node.js in this case)
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the backend code to the container
COPY . .

# Expose the port that your backend app runs on (e.g., 3001)
EXPOSE 3001

# Start the backend app
CMD ["npm", "start"]
