ARG CONTAINER_TAG
FROM wellcome/common_webapp:${CONTAINER_TAG:-test}

WORKDIR /usr/src/app/webapp

ADD webapp ./catalogue/webapp

WORKDIR /usr/src/app/webapp/catalogue/webapp

RUN yarn
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
