terraform {
  required_version = ">= 0.10"

  backend "s3" {
    key            = "terraform.tfstate"
    dynamodb_table = "terraform-locktable"
    bucket         = "wellcomecollection-infra"

    profile        = "experience-dev"
    region         = "eu-west-1"
  }
}

provider "aws" {
  version = "~> 1.0"

  profile = "experience-dev"
  region  = "eu-west-1"
}

# This bucket holds all of our terraform build-state
resource "aws_s3_bucket" "terraform_build_state_bucket" {
  bucket = "wellcomecollection-infra"
  acl    = "private"

  lifecycle {
    prevent_destroy = true
  }
}

module "wellcomecollection" {
  source = "../network"
}

output "vpc_id" {
  value = "${module.wellcomecollection.vpc_id}"
}

output "vpc_subnets" {
  value = "${module.wellcomecollection.vpc_subnets}"
}
