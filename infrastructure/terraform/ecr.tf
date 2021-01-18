resource "aws_ecr_repository" "buildkite" {
  name = "uk.ac.wellcome/buildkite"

  lifecycle {
    prevent_destroy = true
  }
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
