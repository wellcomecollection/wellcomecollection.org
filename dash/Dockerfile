FROM public.ecr.aws/docker/library/node:18-bookworm-slim

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y awscli 

ADD ./webapp /usr/src/app/webapp

ENV AWS_PAGER=""
RUN yarn && \
    yarn build && \
    yarn cache clean

CMD ["true"]
