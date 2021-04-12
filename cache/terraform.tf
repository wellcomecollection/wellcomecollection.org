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
    role_arn = "arn:aws:iam::130871440101:role/experience-read_only"
  }
}

data "terraform_remote_state" "experience" {
  backend = "s3"

  config = {
    role_arn = "arn:aws:iam::130871440101:role/experience-read_only"
    bucket   = "wellcomecollection-experience-infra"
    key      = "terraform/experience.tfstate"
    region   = "eu-west-1"
  }
}

data "terraform_remote_state" "assets" {
  backend = "s3"

  config = {
    bucket   = "wellcomecollection-infra"
    key      = "build-state/router.tfstate"
    region   = "eu-west-1"
    role_arn = "arn:aws:iam::130871440101:role/experience-read_only"
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

