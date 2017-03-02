FROM node:6.1.0

ARG KEYMETRICS_PUBLIC
ARG KEYMETRICS_SECRET
ENV KEYMETRICS_PUBLIC=$KEYMETRICS_PUBLIC
ENV KEYMETRICS_SECRET=$KEYMETRICS_SECRET

# setup a user so as not to run as root
# see: https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
RUN useradd --create-home --user-group wellcomecollection
ENV HOME=/home/wellcomecollection
USER wellcomecollection
WORKDIR $HOME

ADD dist/ dist/
ADD server/ server/

EXPOSE 3000

WORKDIR $HOME/server

CMD ["npm", "run", "app:docker"]
