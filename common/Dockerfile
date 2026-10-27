FROM public.ecr.aws/docker/library/node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y awscli

ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common

ADD ./content/webapp ./content/webapp
ADD ./toggles/webapp ./toggles/webapp
ADD ./identity/webapp ./identity/webapp

RUN yarn setupCommon && yarn cache clean

WORKDIR /usr/src/app/webapp/common

CMD ["true"]
