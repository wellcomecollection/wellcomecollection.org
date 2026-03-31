FROM mcr.microsoft.com/playwright:v1.58.2-noble

ADD ./playwright /usr/src/app/webapp/playwright
WORKDIR /usr/src/app/webapp/playwright

RUN yarn install --production=true && \
  yarn cache clean

CMD ["true"]
