FROM node:9.11.1-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app/webapp
ADD ./catalogue/webapp .
ADD ./common ../../common
RUN yarn install
RUN yarn build
RUN yarn test

EXPOSE 3000
CMD ["yarn", "start"]
