# This image should be built with the parent directory as context
FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:14.17.6

RUN apt-get update && apt-get install -y python python-pip rename
RUN pip install awscli

WORKDIR /app

COPY package.json yarn.lock ./
COPY common ./common
COPY toggles/webapp ./toggles/webapp

WORKDIR identity/webapp
COPY identity/webapp/package.json ./
RUN yarn --frozen-lockfile

COPY identity/webapp .
ENV BUILD_HASH=latest
ENV BUNDLE_ANALYZE=both

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
