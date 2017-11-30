FROM node:8.9.1

RUN set -x \
    chmod +x /usr/local/bin/docker \
    curl -L https://github.com/docker/compose/releases/download/1.17.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose; \
    chmod +x /usr/local/bin/docker-compose; \
    docker-compose --version;
