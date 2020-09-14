FROM node:12.18.3

WORKDIR /usr/src/app/webapp

ADD ./.flowconfig ./.flowconfig
ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common
ADD ./flow-typed ./flow-typed

ADD ./catalogue/webapp ./catalogue/webapp
ADD ./content/webapp ./content/webapp

RUN yarn setupCommon

WORKDIR /usr/src/app/webapp/catalogue/webapp

RUN yarn
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
