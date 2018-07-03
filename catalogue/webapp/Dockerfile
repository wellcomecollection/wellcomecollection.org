FROM node:9.11.1-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app/webapp
COPY ./ ./
COPY ./.dist/common ../../common
RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
