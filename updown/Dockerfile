FROM public.ecr.aws/docker/library/node:16-slim

WORKDIR /usr/src/app

ADD ./ /usr/src/app

RUN yarn && yarn cache clean

CMD ["true"]
