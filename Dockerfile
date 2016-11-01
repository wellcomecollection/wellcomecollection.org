FROM node:6.1.0

# setup a user so as not to run as root
# see: https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
RUN useradd --create-home --user-group wellcomecollection
ENV HOME=/home/wellcomecollection
USER wellcomecollection
WORKDIR $HOME

# RUN mkdir -p ./dist && mkdir -p ./server
ADD dist/ dist/
ADD server/ server/

EXPOSE 3000

WORKDIR $HOME/server

CMD ["npm", "run", "start"]
