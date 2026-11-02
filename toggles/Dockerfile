FROM public.ecr.aws/docker/library/node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205

VOLUME /dist

WORKDIR /usr/src/app/webapp

COPY config/ /usr/src/config/

ADD ./webapp /usr/src/app/webapp

RUN yarn && yarn cache clean

CMD ["true"]
