terraform {
  required_version = ">= 0.9"

  backend "s3" {
    key            = "build-state/events_exhibitions.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}

data "terraform_remote_state" "infra" {
  backend = "s3"

  config {
    bucket = "wellcomecollection-infra"
    key    = "terraform.tfstate"
    region = "eu-west-1"
  }
}

data "terraform_remote_state" "app_cluster" {
  backend = "s3"

  config {
    bucket = "wellcomecollection-infra"
    key    = "build-state/app_cluster.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  version = "~> 1.0"
  region  = "eu-west-1"
}

provider "aws" {
  version = "~> 1.0"
  region  = "us-east-1"
  alias   = "us-east-1"
}
