FROM public.ecr.aws/docker/library/node:12-slim

VOLUME /dist

RUN apt-get update && apt-get install -yq --no-install-recommends zip

WORKDIR /usr/src/app/webapp

ADD . /usr/src/app/webapp

RUN yarn && yarn build && yarn cache clean

RUN cd dist && zip -r ../edge_lambda_origin.zip .

CMD ["true"]
