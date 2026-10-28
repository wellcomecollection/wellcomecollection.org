# This image should be built with the parent directory as context
FROM public.ecr.aws/docker/library/node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205

ARG NEXT_PUBLIC_CIVICUK_API_KEY

WORKDIR /app

COPY package.json yarn.lock ./
COPY common ./common
COPY toggles/webapp ./toggles/webapp
COPY config/ ./config/

WORKDIR content/webapp
COPY content/webapp/package.json ./
RUN yarn --frozen-lockfile && yarn cache clean

COPY content/webapp .

RUN NODE_OPTIONS=--max-old-space-size=4096 yarn build && yarn cache clean

# The app runs under yarn; the base image's bundled npm only adds scanner findings.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# The following are from https://nextjs.org/docs/deployment#docker-image
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --gid 1001 nextjs
# Server data and Next's image cache are written at runtime; the rest of the app stays root-owned.
RUN mkdir -p .server-data .next/cache/images && chown nextjs:nodejs .server-data .next/cache .next/cache/images
USER nextjs

# Exposed at /management/manifest so deploy tooling can see which commit is live.
# Last so a new commit only invalidates this layer, not the install and build.
ARG BUILDKITE_COMMIT
ENV BUILD_COMMIT=$BUILDKITE_COMMIT

EXPOSE 3000
CMD ["yarn", "start"]
