FROM mcr.microsoft.com/playwright:bionic

WORKDIR /usr/src/app/webapp

ADD ./.flowconfig ./.flowconfig
ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common
ADD ./flow-typed ./flow-typed

ADD ./toggles/webapp ./toggles/webapp

RUN yarn setupCommon && \
    yarn cache clean

ADD ./playwright ./playwright

WORKDIR /usr/src/app/webapp/playwright

RUN yarn install --production=true && \
    yarn cache clean

CMD ["true"]