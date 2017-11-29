FROM node:8.9.1

# Docker client
RUN set -x \
    VER="17.03.0-ce" \
    curl -L -o /tmp/docker-$VER.tgz https://get.docker.com/builds/Linux/x86_64/docker-$VER.tgz \
    tar -xz -C /tmp -f /tmp/docker-$VER.tgz \
    mv /tmp/docker/* /usr/local/bin

# Docker compose
RUN set -x \
    curl -L https://github.com/docker/compose/releases/download/1.17.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose \
    chmod +x /usr/local/bin/docker-compose
