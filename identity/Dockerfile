# This image should be built with the parent directory as context
FROM public.ecr.aws/docker/library/node:24.13.0-bookworm-slim

# We add awscli so that we can run the app locally in a container using creds
# from AWS
RUN apt-get update
RUN apt-get -y install awscli

ARG NEXT_PUBLIC_CIVICUK_API_KEY

WORKDIR /app

COPY package.json yarn.lock ./
COPY common ./common
COPY toggles/webapp ./toggles/webapp
COPY config/ ./config/

WORKDIR identity/webapp
COPY identity/webapp/package.json ./
RUN yarn --frozen-lockfile && yarn cache clean

COPY identity/webapp .

RUN yarn build && yarn cache clean

# Exposed at /management/manifest so deploy tooling can see which commit is live.
# Last so a new commit only invalidates this layer, not the install and build.
ARG BUILDKITE_COMMIT
ENV BUILD_COMMIT=$BUILDKITE_COMMIT

EXPOSE 3000
CMD ["yarn", "start"]
