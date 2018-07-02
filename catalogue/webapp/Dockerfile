FROM node:9.11.1-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app/webapp
COPY ./catalogue/webapp .
COPY ./common ../../common
RUN yarn install
RUN yarn build

HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:3000/works || exit 1

EXPOSE 3000
CMD ["yarn", "start"]
