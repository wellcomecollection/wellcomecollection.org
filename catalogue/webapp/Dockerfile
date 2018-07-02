FROM node:9.11.1-alpine
FROM appropriate/curl:latest

ENV NODE_ENV=production

WORKDIR /usr/src/app/webapp
COPY ./catalogue/webapp .
COPY ./common ../../common
RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
