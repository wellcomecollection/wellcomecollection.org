FROM public.ecr.aws/docker/library/node:12-slim

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y awscli

ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common

ADD ./catalogue/webapp ./catalogue/webapp
ADD ./content/webapp ./content/webapp
ADD ./toggles/webapp ./toggles/webapp
ADD ./identity/webapp ./identity/webapp

RUN yarn setupCommon && yarn cache clean

WORKDIR /usr/src/app/webapp/common

CMD ["true"]
