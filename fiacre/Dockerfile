# Simple Dockerfile to serve the static `fiacre` site with nginx
FROM nginx:alpine

# Remove default content and copy project files into nginx html dir
RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html/

# Expose HTTP
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
