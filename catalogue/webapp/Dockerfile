FROM node:alpine

ENV NODE_ENV=production

# You need to `yarn build` before doing this
WORKDIR /usr/src/app/webapp
COPY . .
RUN yarn build
CMD ["yarn", "start"]
