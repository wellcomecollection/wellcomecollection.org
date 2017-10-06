terraform {
  required_version = ">= 0.9"

  backend "s3" {
    key            = "build-state/router.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}

data "terraform_remote_state" "wellcomecollection" {
  backend = "s3"

  config {
    bucket = "wellcomecollection-infra"
    key    = "terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region     = "eu-west-1"
  version = "~> 0.1"
}
