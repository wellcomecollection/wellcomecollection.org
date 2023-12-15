# These images are used for in-build caching within a build pipeline.
# We don't need to keep them beyond the lifetime of a given build,
# although we keep them around for a short time so we can re-run build jobs.

resource "aws_ecr_repository" "buildkite" {
  name = "uk.ac.wellcome/buildkite"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecr_lifecycle_policy" "buildkite" {
  repository = aws_ecr_repository.buildkite.name
  policy     = local.ecr_policy_expire_images_after_3_days
}

# These images are used for our applications.
#
# We need to keep them around for a while, because we don't deploy an image
# immediately after it's published -- but we also don't need to keep them
# around forever.
#
# At time of writing (February 2022), we have over 3000 Docker images in
# these three repositories, which is way more than we need.

resource "aws_ecr_repository" "content_webapp" {
  name = "uk.ac.wellcome/content_webapp"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecr_lifecycle_policy" "content_webapp" {
  repository = aws_ecr_repository.content_webapp.name
  policy     = local.ecr_policy_only_keep_the_last_100_images
}

# Removing is a 2 step process where we first remove the policy and then the repository
resource "aws_ecr_repository" "catalogue_webapp" {
  name = "uk.ac.wellcome/catalogue_webapp"
}

resource "aws_ecr_repository" "identity_webapp" {
  name = "uk.ac.wellcome/identity_webapp"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecr_lifecycle_policy" "identity_webapp" {
  repository = aws_ecr_repository.identity_webapp.name
  policy     = local.ecr_policy_only_keep_the_last_100_images
}

resource "aws_ecr_repository" "playwright" {
  name = "weco/playwright"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecr_lifecycle_policy" "playwright" {
  repository = aws_ecr_repository.playwright.name
  policy     = local.ecr_policy_only_keep_the_last_100_images
}
