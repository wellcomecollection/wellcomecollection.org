# This image should be built with the parent directory as context
FROM public.ecr.aws/docker/library/node:16-slim

WORKDIR /app

COPY package.json yarn.lock ./
COPY common ./common
COPY toggles/webapp ./toggles/webapp

WORKDIR catalogue/webapp
COPY catalogue/webapp/package.json ./
RUN yarn --frozen-lockfile && yarn cache clean

COPY catalogue/webapp .

RUN yarn build && yarn cache clean

# The following are from https://nextjs.org/docs/deployment#docker-image
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --gid 1001 nextjs
USER nextjs

EXPOSE 3000
CMD ["yarn", "start"]
