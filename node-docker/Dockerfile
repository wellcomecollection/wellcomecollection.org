FROM node:8.9.1
RUN set -ex; \
    # Docker
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -; \
    apt-key fingerprint 0EBFCD88; \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable edge"; \
    apt-get update && apt-get install -y --no-install-recommends docker-ce=17.09.0~ce-0~debian; \
    docker --version; \

    # Docker Compose
    curl -L https://github.com/docker/compose/releases/download/1.17.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose; \
    chmod +x /usr/local/bin/docker-compose; \
    docker-compose --version; \
