FROM node:12.18.3

VOLUME /dist

RUN apt-get update && apt-get install -yq --no-install-recommends zip

WORKDIR /usr/src/app/webapp

ADD . /usr/src/app/webapp

RUN yarn

RUN zip -r edge_lambda_origin.zip toggler.js origin.js redirector.js redirects.js wiRedirector.js

CMD ["cp", "/usr/src/app/webapp/edge_lambda_origin.zip", "/dist/.dist/edge_lambda_origin.zip"]
