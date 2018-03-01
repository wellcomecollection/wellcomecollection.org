FROM node:alpine

ENV NODE_ENV=production

# You need to `yarn build` before doing this
WORKDIR /usr/src/app/webapp
COPY ./catalogue/webapp .
COPY ./common ../../common
RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
