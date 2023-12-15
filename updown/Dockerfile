FROM public.ecr.aws/docker/library/node:16-slim

WORKDIR /app

ADD package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

ADD . ./

CMD ["true"]
