FROM public.ecr.aws/docker/library/node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205

COPY ./package.json /repo/package.json
COPY ./yarn.lock /repo/yarn.lock
COPY config/ /config/

COPY . /repo
WORKDIR /repo/prismic-model

RUN yarn && yarn install --frozen-lockfile

CMD ["true"]
