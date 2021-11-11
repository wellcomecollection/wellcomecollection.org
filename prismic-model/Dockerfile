FROM 760097843905.dkr.ecr.eu-west-1.amazonaws.com/node:14-alpine

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

CMD ["true"]