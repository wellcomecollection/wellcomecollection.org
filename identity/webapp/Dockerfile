
FROM 770700576653.dkr.ecr.eu-west-1.amazonaws.com/uk.ac.wellcome/identity-node:12 as build

WORKDIR /home/node/app

ADD ./package.json /home/node/app/package.json
ADD ./yarn.lock /home/node/app/yarn.lock

RUN yarn install --no-interactive --frozen-lockfile

COPY ./src /home/node/app/src
COPY ./schemas /home/node/app/schemas
COPY ./webpack.frontend.js /home/node/app/webpack.frontend.js
COPY ./tsconfig.json /home/node/app/tsconfig.json
COPY ./tsconfig.frontend.json /home/node/app/tsconfig.frontend.json
COPY ./generate-schemas.js /home/node/app/generate-schemas.js

ENV NODE_ENV=production

RUN yarn build

FROM 770700576653.dkr.ecr.eu-west-1.amazonaws.com/uk.ac.wellcome/identity-node:12 as modules

WORKDIR /home/node/app

COPY --from=build /home/node/app/package.json /home/node/app/package.json
COPY --from=build /home/node/app/yarn.lock /home/node/app/yarn.lock

RUN yarn install --no-interactive --frozen-lockfile

FROM 770700576653.dkr.ecr.eu-west-1.amazonaws.com/uk.ac.wellcome/identity-node:12

WORKDIR /home/node/app

RUN npm install -g pm2

COPY --from=build /home/node/app/package.json /home/node/app/package.json
COPY --from=build /home/node/app/yarn.lock /home/node/app/yarn.lock
COPY --from=modules /home/node/app/node_modules /home/node/app/node_modules
COPY --from=build /home/node/app/lib /home/node/app/lib
COPY --from=build /home/node/app/schemas /home/node/app/schemas
COPY ./webpack.frontend.js /home/node/app/webpack.frontend.js
COPY ./ecosystem.config.js /home/node/app/ecosystem.config.js

ENV SERVER_PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

USER node

COPY ./schemas /home/node/app/schemas
COPY ./generate-schemas.js /home/node/app/generate-schemas.js

CMD ["pm2-runtime", "start", "./ecosystem.config.js"]
