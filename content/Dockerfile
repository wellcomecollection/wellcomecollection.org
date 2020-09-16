FROM common_webapp

WORKDIR /usr/src/app/webapp/content/webapp

ENV BUILD_HASH=latest
ENV BUNDLE_ANALYZE=both

RUN yarn
RUN yarn build

WORKDIR /usr/src/app/webapp/content/webapp/.dist
RUN rename 's/^/content./' *

WORKDIR /usr/src/app/webapp/content/webapp

EXPOSE 3000

CMD ["yarn", "start"]
