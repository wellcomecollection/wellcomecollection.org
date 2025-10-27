FROM public.ecr.aws/docker/library/node:24-bookworm-slim

COPY ./package.json /repo/package.json
COPY ./yarn.lock /repo/yarn.lock
COPY config/ /config/

COPY . /repo
WORKDIR /repo/prismic-model

RUN yarn && yarn install --frozen-lockfile

CMD ["true"]