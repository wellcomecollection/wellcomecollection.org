FROM node:12.18.3-alpine

RUN apk add python make g++

WORKDIR /usr/src/app/webapp

ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common

RUN yarn setupCommon

CMD ["true"]

