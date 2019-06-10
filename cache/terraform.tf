locals {
  edge_lambda_request_version  = 18
  edge_lambda_response_version = 19
}

# Setup terraform for this service
terraform {
  required_version = ">= 0.11.10"

  backend "s3" {
    key            = "build-state/cache.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}

# Make sure we're using AWS as provider
provider "aws" {
  version = "~> 1.56.0"
  region  = "us-east-1"
}

# Making the router state outputs available
# e.g. ${data.terraform_remote_state.router.alb_dns_name}
data "terraform_remote_state" "router" {
  backend = "s3"

  config {
    bucket = "wellcomecollection-infra"
    key    = "build-state/router.tfstate"
    region = "eu-west-1"
  }
}

# Lookup certificate to use ARN later on
data "aws_acm_certificate" "wellcomecollection_ssl_cert" {
  domain = "wellcomecollection.org"
}

resource "aws_s3_bucket" "lambdas" {
  bucket = "weco-lambdas"
  acl    = "private"

  versioning {
    enabled = true
  }
}

output "s3_edge_lambda_origin_version_id" {
  value = "${data.aws_s3_bucket_object.edge_lambda_origin.version_id}"
}

output "latest_edge_lambda_origin_request_version" {
  value = "${aws_lambda_function.edge_lambda_request.version}"
}

output "latest_edge_lambda_origin_response_version" {
  value = "${aws_lambda_function.edge_lambda_response.version}"
}
