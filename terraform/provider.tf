terraform {
  required_version = ">= 0.11.10"

  backend "s3" {
    key            = "build-state/terraform-config.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}

provider "aws" {
  version = "~> 1.56.0"
  region  = "eu-west-1"
}

provider "template" {
  version = "~> 2.0.0"
}
