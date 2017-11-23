FROM node:8-alpine

# setup a user so as not to run as root
# see: https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
RUN adduser -S wellcomecollection
ENV HOME=/home/wellcomecollection
USER wellcomecollection
WORKDIR $HOME/

ADD ./exhibitions/app ./exhibitions/app
ADD ./server/ ./server/

WORKDIR $HOME/exhibitions/app/.dist
EXPOSE 3000
CMD ["node", "app"]
