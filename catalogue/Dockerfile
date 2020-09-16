FROM common_webapp

WORKDIR /usr/src/app/webapp/catalogue/webapp

ENV BUILD_HASH=latest
ENV BUNDLE_ANALYZE=both

RUN yarn
RUN yarn build

WORKDIR /usr/src/app/webapp/catalogue/webapp/.dist
RUN rename 's/^/catalogue./' *

WORKDIR /usr/src/app/webapp/catalogue/webapp

EXPOSE 3000

CMD ["yarn", "start"]
