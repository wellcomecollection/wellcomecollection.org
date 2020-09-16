FROM common_webapp

WORKDIR /usr/src/app/webapp

ADD ./docs ./docs
ADD ./cardigan ./cardigan

WORKDIR /usr/src/app/webapp/cardigan

RUN yarn
RUN yarn build

CMD ["true"]
