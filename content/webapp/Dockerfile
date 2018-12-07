FROM node:9.11.1-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app/webapp
ADD ./package.json ./package.json
ADD ./common ./common
ADD ./content/webapp ./content/webapp
RUN yarn install

WORKDIR /usr/src/app/webapp/content/webapp
RUN yarn build
RUN yarn test
EXPOSE 3000
CMD ["yarn", "start"]
