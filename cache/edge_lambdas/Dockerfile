FROM public.ecr.aws/docker/library/node:18-bookworm-slim

RUN apt-get update && apt-get install -yq --no-install-recommends git zip

ADD .git /repo/.git
ADD cache/edge_lambdas /repo/cache/edge_lambdas
WORKDIR /repo/cache/edge_lambdas

RUN yarn && yarn build && yarn cache clean

RUN cd dist && zip -r ../edge_lambda_origin.zip .

CMD ["true"]
