FROM public.ecr.aws/docker/library/node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205

RUN apt-get update && apt-get install -yq --no-install-recommends git

ADD .git /repo/.git
ADD cache/edge_lambdas /repo/cache/edge_lambdas
WORKDIR /repo/cache/edge_lambdas

RUN yarn && yarn build && yarn cache clean

CMD ["true"]
