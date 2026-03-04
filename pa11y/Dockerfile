FROM public.ecr.aws/docker/library/node:24.13.0-bookworm-slim

VOLUME /dist


# Set of system libraries required for running Node.js applications and tools
# like Puppeteer or Chromium (used for headless browser testing).
RUN apt-get update && apt-get install -yq --no-install-recommends \
  libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libdrm2 libexpat1 libgbm1 libglib2.0-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0  \
  libstdc++6 libudev1 libuuid1 libx11-6 libx11-xcb1 libxcb-dri3-0 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
  libxext6 libxfixes3 libxi6 libxkbcommon0 libxrandr2 libxrender1 libxshmfence1 libxss1 libxtst6

WORKDIR /usr/src/app/webapp

ADD ./webapp /usr/src/app/webapp

RUN yarn && \
  yarn report-and-deploy --isPullRequestRun --no-sandbox && \
  yarn cache clean

CMD ["true"]
