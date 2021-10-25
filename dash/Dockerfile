FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:12.18.3

WORKDIR /usr/src/app/webapp

RUN apt-get update && apt-get install -y python python-pip
RUN pip install awscli

ADD ./webapp /usr/src/app/webapp

RUN yarn
RUN yarn build
RUN yarn export

CMD ["true"]
