ENV_TAG=content-env.e2e \
  LATEST_TAG=wc-dot-org-build-plus-test-content-build-11582 \
    .buildkite/scripts/update_ecr_image_tag.sh \
    uk.ac.wellcome/buildkite

ENV_TAG=catalogue-env.e2e \
  LATEST_TAG=wc-dot-org-build-plus-test-catalogue-build-11582 \
    .buildkite/scripts/update_ecr_image_tag.sh \
    uk.ac.wellcome/buildkite

ENV_TAG=identity-env.e2e \
  LATEST_TAG=wc-dot-org-build-plus-test-identity-build-11582 \
    .buildkite/scripts/update_ecr_image_tag.sh \
    uk.ac.wellcome/buildkite
