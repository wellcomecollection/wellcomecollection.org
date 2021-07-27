FROM node:14-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

ADD src ./src

CMD ["yarn", "start"]
