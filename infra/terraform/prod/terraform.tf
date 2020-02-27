terraform {

  backend "s3" {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"

    key            = "terraform.tfstate"
    dynamodb_table = "terraform-locktable"
    bucket         = "wellcomecollection-infra"
    region         = "eu-west-1"
  }
}

provider "aws" {
  region  = "eu-west-1"
  version = "~> 2.7"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
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
  value = module.wellcomecollection.vpc_id
}

output "vpc_subnets" {
  value = module.wellcomecollection.vpc_subnets
}
