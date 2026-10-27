# This image should be built with the parent directory as context
FROM public.ecr.aws/docker/library/node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205

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

# The app runs under yarn; the base image's bundled npm only adds scanner findings.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Exposed at /management/manifest so deploy tooling can see which commit is live.
# Last so a new commit only invalidates this layer, not the install and build.
ARG BUILDKITE_COMMIT
ENV BUILD_COMMIT=$BUILDKITE_COMMIT

EXPOSE 3000
CMD ["yarn", "start"]
