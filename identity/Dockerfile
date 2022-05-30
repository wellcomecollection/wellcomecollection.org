# This image should be built with the parent directory as context
FROM public.ecr.aws/docker/library/node:14-slim

RUN apt-get update && apt-get install -y awscli

WORKDIR /app

COPY package.json yarn.lock ./
COPY common ./common
COPY toggles/webapp ./toggles/webapp

WORKDIR identity/webapp
COPY identity/webapp/package.json ./
RUN yarn --frozen-lockfile && \
    yarn cache clean

COPY identity/webapp .
ENV BUILD_HASH=latest
ENV BUNDLE_ANALYZE=both

RUN yarn build && \
    yarn cache clean

EXPOSE 3000
CMD ["yarn", "start"]
