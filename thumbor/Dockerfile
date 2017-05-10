FROM apsl/thumbor

# TODO: Find a wat to restrict the prismic bucket to `/wellcomecollection`
ENV ALLOWED_SOURCES="['prismic-io.s3.amazonaws.com', 'wellcomecollection.files.wordpress.com']" \
    LOADER="thumbor.loaders.https_loader"
