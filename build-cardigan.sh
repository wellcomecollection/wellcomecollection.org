pushd server
npm run build
popd

pushd cardigan
aws s3 sync . s3://cardigan.wellcomecollection.org
popd
