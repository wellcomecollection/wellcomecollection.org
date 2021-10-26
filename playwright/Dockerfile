FROM mcr.microsoft.com/playwright:bionic

WORKDIR /usr/src
ADD . /usr/src
RUN yarn install --production=true && yarn cache clean

CMD ["true"]