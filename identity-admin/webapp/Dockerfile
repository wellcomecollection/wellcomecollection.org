FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:12.18.3

RUN apt-get update && apt-get install -y libvips

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN yarn
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]