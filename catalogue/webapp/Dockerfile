FROM node:10.15.1-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app/webapp
ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common
ADD ./catalogue/webapp ./catalogue/webapp
# This is needed for node-sass
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && yarn install \
    && apk del .gyp

WORKDIR /usr/src/app/webapp/catalogue/webapp
RUN yarn build
RUN yarn test
EXPOSE 3000
CMD ["yarn", "start"]
