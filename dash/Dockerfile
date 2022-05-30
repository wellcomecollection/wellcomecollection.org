FROM public.ecr.aws/docker/library/node:12-slim

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y awscli

ADD ./webapp /usr/src/app/webapp

RUN yarn && \
    yarn build && \
    yarn export && \
    yarn cache clean

CMD ["true"]
