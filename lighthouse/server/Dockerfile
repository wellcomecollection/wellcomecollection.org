FROM public.ecr.aws/docker/library/node:14-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

ADD src ./src

CMD ["yarn", "start"]
