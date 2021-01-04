# This image should be built with the parent directory as context
FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:12.18.3

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y python python-pip rename
RUN pip install awscli

ADD ./.flowconfig ./.flowconfig
ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common
ADD ./flow-typed ./flow-typed

ADD ./catalogue/webapp ./catalogue/webapp
ADD ./content/webapp ./content/webapp
ADD ./toggles/webapp ./toggles/webapp

RUN yarn setupCommon

WORKDIR /usr/src/app/webapp/catalogue/webapp

ENV BUILD_HASH=latest
ENV BUNDLE_ANALYZE=both

RUN yarn
RUN yarn build

WORKDIR /usr/src/app/webapp/catalogue/webapp/.dist
RUN rename 's/^/catalogue./' *

WORKDIR /usr/src/app/webapp/catalogue/webapp

EXPOSE 3000

CMD ["yarn", "start"]
