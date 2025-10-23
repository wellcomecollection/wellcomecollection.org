# This image should be built with the parent directory as context
FROM public.ecr.aws/docker/library/node:20-bookworm-slim

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

EXPOSE 3000
CMD ["yarn", "start"]
