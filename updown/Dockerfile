FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:14.14.0

WORKDIR /usr/src/app

ADD ./ /usr/src/app

RUN yarn && yarn cache clean

CMD ["true"]
