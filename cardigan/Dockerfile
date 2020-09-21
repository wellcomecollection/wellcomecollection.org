FROM node:12.18.3

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y python python-pip
RUN pip install awscli

ADD ./.flowconfig ./.flowconfig
ADD ./package.json ./package.json
ADD ./yarn.lock ./yarn.lock
ADD ./common ./common
ADD ./flow-typed ./flow-typed

ADD ./catalogue/webapp ./catalogue/webapp
ADD ./content/webapp ./content/webapp

RUN yarn setupCommon

ADD ./docs ./docs
ADD ./cardigan ./cardigan

WORKDIR /usr/src/app/webapp/cardigan

RUN yarn
RUN yarn build

CMD ["true"]
