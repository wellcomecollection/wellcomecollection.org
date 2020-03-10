locals {
  edge_lambda_request_version  = 36
  edge_lambda_response_version = 37

  wellcome_cdn_cert_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"
  wellcome_cdn_cert_arn_old = "arn:aws:acm:us-east-1:130871440101:certificate/9b4d357e-689f-4fd3-bf12-4e6c5fd4af35"
}

# Setup terraform for this service
terraform {
  backend "s3" {
    key            = "build-state/cache.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
    role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

# Make sure we're using AWS as provider
provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

# Making the router state outputs available
# e.g. ${data.terraform_remote_state.router.alb_dns_name}
data "terraform_remote_state" "router" {
  backend = "s3"

  config = {
    bucket   = "wellcomecollection-infra"
    key      = "build-state/router.tfstate"
    region   = "eu-west-1"
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

data "terraform_remote_state" "assets" {
  backend = "s3"

  config = {
    bucket   = "wellcomecollection-infra"
    key      = "build-state/router.tfstate"
    region   = "eu-west-1"
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

resource "aws_s3_bucket" "lambdas" {
  bucket = "weco-lambdas"
  acl    = "private"

  versioning {
    enabled = true
  }
}

output "s3_edge_lambda_origin_version_id" {
  value = data.aws_s3_bucket_object.edge_lambda_origin.version_id
}

output "latest_edge_lambda_origin_request_version" {
  value = aws_lambda_function.edge_lambda_request.version
}

output "latest_edge_lambda_origin_response_version" {
  value = aws_lambda_function.edge_lambda_response.version
}

