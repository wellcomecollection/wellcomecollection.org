FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:12.18.3

VOLUME /dist

RUN apt-get update && apt-get install -yq --no-install-recommends zip

WORKDIR /usr/src/app/webapp

ADD . /usr/src/app/webapp

RUN yarn && yarn build

RUN cd dist && zip -r ../edge_lambda_origin.zip .

CMD ["true"]
