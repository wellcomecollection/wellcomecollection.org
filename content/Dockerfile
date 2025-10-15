# This image should be built with the parent directory as context
FROM public.ecr.aws/docker/library/node:20-bookworm-slim

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

RUN yarn build && yarn cache clean

# The following are from https://nextjs.org/docs/deployment#docker-image
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --gid 1001 nextjs
USER nextjs

EXPOSE 3000
CMD ["yarn", "start"]
