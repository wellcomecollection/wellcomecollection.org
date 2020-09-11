FROM experiencebase

VOLUME /workdir
WORKDIR /workdir

RUN yarn testCatalogue

CMD ["true"]

