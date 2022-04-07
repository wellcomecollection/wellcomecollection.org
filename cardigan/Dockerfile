# This image should be built with the parent directory as context
FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:12.18.3

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y awscli

ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common

ADD ./catalogue/webapp ./catalogue/webapp
ADD ./content/webapp ./content/webapp
ADD ./toggles/webapp ./toggles/webapp
ADD ./identity/webapp ./identity/webapp
ADD ./cardigan ./cardigan

RUN ./cardigan/run_yarn.sh

WORKDIR /usr/src/app/webapp/cardigan

CMD ["true"]
