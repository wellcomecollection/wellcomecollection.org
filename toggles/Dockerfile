FROM public.ecr.aws/docker/library/node:24-bookworm-slim

VOLUME /dist

WORKDIR /usr/src/app/webapp

COPY config/ /usr/src/config/

ADD ./webapp /usr/src/app/webapp

RUN yarn && yarn cache clean

CMD ["true"]
