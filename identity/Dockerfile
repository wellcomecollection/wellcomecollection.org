# This image should be built with the parent directory as context
FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:14.17.6

RUN apt-get update && apt-get install -y awscli rename

WORKDIR /app

COPY package.json yarn.lock ./
COPY common ./common
COPY toggles/webapp ./toggles/webapp

WORKDIR identity/webapp
COPY identity/webapp/package.json ./
RUN yarn --frozen-lockfile && yarn cache clean

COPY identity/webapp .
ENV BUILD_HASH=latest
ENV BUNDLE_ANALYZE=both

RUN yarn build && yarn cache clean

EXPOSE 3000
CMD ["yarn", "start"]
