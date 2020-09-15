FROM node:12.18.3

VOLUME /dist

WORKDIR /usr/src/app/webapp

ADD ./webapp /usr/src/app/webapp

RUN yarn
RUN yarn build

CMD ["true"]
