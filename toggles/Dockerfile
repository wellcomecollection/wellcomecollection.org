FROM public.ecr.aws/docker/library/node:12-slim

VOLUME /dist

WORKDIR /usr/src/app/webapp

ADD ./webapp /usr/src/app/webapp

RUN yarn && yarn cache clean

CMD ["true"]
