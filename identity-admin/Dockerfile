FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:12.18.3

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y python python-pip rename
RUN pip install awscli

WORKDIR /usr/src/app/webapp/identity-admin/webapp

ENV BUILD_HASH=latest
ENV BUNDLE_ANALYZE=both

RUN yarn
RUN yarn build

WORKDIR /usr/src/app/webapp/identity-admin/webapp/.dist
RUN rename 's/^/identity-admin./' *

WORKDIR /usr/src/app/webapp/identity-admin/webapp

EXPOSE 3000

CMD ["yarn", "start"]
