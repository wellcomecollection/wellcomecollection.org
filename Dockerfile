FROM node:8-alpine

# setup a user so as not to run as root
# see: https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
RUN adduser -S wellcomecollection
ENV HOME=/home/wellcomecollection
USER wellcomecollection
WORKDIR $HOME

ADD dist/ dist/
ADD server/ server/

EXPOSE 3000

WORKDIR $HOME/server

CMD ["npx", "pm2-docker", "--json", "pm2.yml"]
