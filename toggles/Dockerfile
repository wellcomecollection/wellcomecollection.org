FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:12.18.3

VOLUME /dist

WORKDIR /usr/src/app/webapp

ADD ./webapp /usr/src/app/webapp

RUN yarn
RUN yarn build

CMD ["true"]
