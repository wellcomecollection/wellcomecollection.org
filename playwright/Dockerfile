FROM mcr.microsoft.com/playwright:v1.40.1-focal

# There is currently an issue when running WebKit (mobile) on certain Linux Docker images
# which causes tests to fail incorrectly:
# https://github.com/microsoft/playwright/issues/13060
# To fix this, ideally we would be on Ubuntu jammy (22.04 LTS rather than focal, 20.04 LTS)
# but currently the Docker version used in Buildkite agents causes a segfault
# when Node starts https://github.com/nodejs/node/issues/43064, so instead we upgrade
# packages manually (within focal).
RUN apt update && apt upgrade -y

ADD ./playwright /usr/src/app/webapp/playwright
WORKDIR /usr/src/app/webapp/playwright

RUN yarn install --production=true && \
    yarn cache clean

CMD ["true"]
