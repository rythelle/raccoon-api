FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY htpasswd /etc/nginx/htpasswd

EXPOSE 80
EXPOSE 443