terraform {
  required_version = ">= 0.11"

  backend "s3" {
    key            = "build-state/circleci.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}

provider "aws" {
  version = "~> 2.2"
  region  = "eu-west-1"
}

data "aws_iam_policy_document" "circleci_policy_document" {
  statement {
    actions = ["s3:PutObject"]

    resources = [
      "arn:aws:s3:::cardigan.wellcomecollection.org/*",
      "arn:aws:s3:::i.wellcomecollection.org/*",
      "arn:aws:s3:::dash.wellcomecollection.org/*",
      "arn:aws:s3:::weco-lambdas/*",
      "arn:aws:s3:::toggles.wellcomecollection.org/*",
    ]
  }
}

resource "aws_iam_policy" "circleci" {
  name        = "CircleCIDeployment"
  path        = "/circleci/"
  description = "Allowing CircleCI to interact with our infrastructure"
  policy      = "${data.aws_iam_policy_document.circleci_policy_document.json}"
}
