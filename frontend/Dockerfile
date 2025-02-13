### Build Stage ###
# Build the application with NodeJS 22.13 (running on Alpine Linux)
FROM node:22.13-alpine3.20 AS build

# Set up the environment
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build the React App
RUN npm run build

### Production Stage ###
# Serving the static files using NGINX (running on Alpine Linux).
FROM nginx:1.26-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html

# Running the web server
EXPOSE 80
cmd ["nginx", "-g", "daemon off;"]

