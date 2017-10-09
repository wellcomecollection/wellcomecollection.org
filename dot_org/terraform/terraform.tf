terraform {
  required_version = ">= 0.10"

  backend "s3" {
    key            = "terraform.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-dot_org"
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
