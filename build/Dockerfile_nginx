FROM nginx:1.13.8-alpine
ARG WEBAPP_PORT
COPY ./build/nginx.conf /etc/nginx/nginx.conf
RUN sed -i "s/WEBAPP_PORT/${WEBAPP_PORT}/g" /etc/nginx/nginx.conf
