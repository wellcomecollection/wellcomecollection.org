FROM node:12.18.3-alpine

VOLUME /workdir
WORKDIR /workdir

RUN apk add docker py-pip python3 python3-dev libffi-dev openssl-dev gcc libc-dev make make g++
RUN pip3 install docker-compose

RUN yarn testFlow
RUN yarn testCommon

CMD ["true"]

