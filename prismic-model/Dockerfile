FROM public.ecr.aws/docker/library/node:18-bookworm-slim

COPY ./package.json /repo/package.json
COPY ./yarn.lock /repo/yarn.lock

COPY . /repo
WORKDIR /repo/prismic-model

RUN yarn && yarn install --frozen-lockfile

CMD ["true"]