FROM public.ecr.aws/docker/library/node:20-bookworm-slim

VOLUME /dist

WORKDIR /usr/src/app/webapp

ADD ./webapp /usr/src/app/webapp

RUN yarn && \
  yarn write-report --no-sandbox && \
  yarn cache clean

CMD ["true"]
