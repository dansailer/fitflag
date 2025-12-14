FROM node:24-alpine AS build
WORKDIR /app

# Accept build arguments for Vite environment variables
ARG VITE_QUARKUS_URL
ARG VITE_FLAGD_HOST
ARG VITE_FLAGD_PORT
ARG VITE_FLAGD_PATH_PREFIX
ARG VITE_FLAGD_TLS

# Convert build args to environment variables for Vite
ENV VITE_QUARKUS_URL=$VITE_QUARKUS_URL
ENV VITE_FLAGD_HOST=$VITE_FLAGD_HOST
ENV VITE_FLAGD_PORT=$VITE_FLAGD_PORT
ENV VITE_FLAGD_PATH_PREFIX=$VITE_FLAGD_PATH_PREFIX
ENV VITE_FLAGD_TLS=$VITE_FLAGD_TLS

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
