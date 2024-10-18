# Stage 1: Build the React app
FROM node:16-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy source files and build the app
COPY . ./
RUN npm run build

# Stage 2: Serve the build with NGINX
FROM nginx:alpine

# Copy the build artifacts from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf       
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose the NGINX port
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
