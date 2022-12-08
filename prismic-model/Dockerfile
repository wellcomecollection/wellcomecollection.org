FROM public.ecr.aws/docker/library/node:14-slim

COPY ./package.json /repo/package.json
COPY ./yarn.lock /repo/yarn.lock

COPY ./prismic-model /repo/prismic-model
WORKDIR /repo/prismic-model

RUN yarn install --frozen-lockfile

CMD ["true"]