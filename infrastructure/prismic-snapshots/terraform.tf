terraform {
  required_version = ">= 0.12"

  backend "s3" {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
    bucket   = "wellcomecollection-infra"
    key      = "build-state/prismic-snapshots.tfstate"
    region   = "eu-west-1"

    dynamodb_table = "terraform-locktable"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}
