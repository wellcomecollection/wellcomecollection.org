FROM experiencebase

WORKDIR /usr/src/app/webapp

ADD webapp ./content/webapp

WORKDIR /usr/src/app/webapp/content/webapp

RUN yarn
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
