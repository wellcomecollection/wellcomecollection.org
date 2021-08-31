resource "aws_ecr_repository" "buildkite" {
  name = "uk.ac.wellcome/buildkite"

  lifecycle {
    prevent_destroy = true
  }
}

# These images are used for in-build caching within a build pipeline.
# We don't need to keep them beyond the lifetime of a given build,
# although we keep them around for a short time so we can re-run build jobs.

resource "aws_ecr_lifecycle_policy" "buildkite" {
  repository = aws_ecr_repository.buildkite.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire images after 7 days"
        selection = {
          tagStatus   = "any"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

resource "aws_ecr_repository" "content_webapp" {
  name = "uk.ac.wellcome/content_webapp"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecr_repository" "catalogue_webapp" {
  name = "uk.ac.wellcome/catalogue_webapp"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecr_repository" "identity_webapp" {
  name = "uk.ac.wellcome/identity_webapp"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_ecr_repository" "identity-admin_webapp" {
  name = "uk.ac.wellcome/identity-admin_webapp"

  lifecycle {
    prevent_destroy = true
  }
}
