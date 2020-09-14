FROM node:12.18.3

VOLUME /dist
WORKDIR /usr/src/app/webapp

ADD ./.flowconfig ./.flowconfig
ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common
ADD ./flow-typed ./flow-typed

ADD ./catalogue/webapp ./catalogue/webapp
ADD ./content/webapp ./content/webapp

RUN yarn setupCommon

ADD ./docs ./docs
ADD ./cardigan ./cardigan

WORKDIR /usr/src/app/webapp/cardigan

RUN yarn
RUN yarn build

CMD ["cp","-rf", "/usr/src/app/webapp/cardigan/.dist", "/dist"]
