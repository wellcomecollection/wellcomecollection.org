# pa11y-dashboard Docker Container
# https://github.com/pa11y/dashboard
FROM node:5
MAINTAINER Rob Loach <robloach@gmail.com>

# Dependencies
RUN apt-get update -y && apt-get upgrade -y && apt-get install net-tools -y

# Environment variables
ENV NODE_ENV ${NODE_ENV:-production}

# Install PhantomJS
RUN npm install phantomjs-prebuilt@2 -g

# Retrieve the dashboard
RUN git clone https://github.com/pa11y/dashboard.git && cd dashboard && npm i
WORKDIR ./dashboard

EXPOSE 4000
EXPOSE 3000

COPY production.json ./config/production.json
CMD ["node", "."]
