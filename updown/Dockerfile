FROM public.ecr.aws/docker/library/node:20-bookworm-slim

WORKDIR /app

ADD package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

ADD . ./

CMD ["true"]
