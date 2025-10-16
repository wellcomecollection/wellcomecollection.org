FROM public.ecr.aws/docker/library/node:24-bookworm-slim

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y awscli 

COPY dash/webapp /usr/src/app/webapp
COPY config /usr/src/config

# `less` isn't installed on the image and so we're disabling it as per
# https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-pagination.html#cli-usage-pagination-clientside 
ENV AWS_PAGER=""
RUN yarn && \
    yarn build && \
    yarn cache clean

CMD ["true"]
