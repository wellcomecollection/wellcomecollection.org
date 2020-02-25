terraform {
  backend "s3" {
    key            = "build-state/preview.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
    role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

data "terraform_remote_state" "infra" {
  backend = "s3"

  config = {
    bucket   = "wellcomecollection-infra"
    key      = "terraform.tfstate"
    region   = "eu-west-1"
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

data "terraform_remote_state" "router" {
  backend = "s3"

  config = {
    bucket   = "wellcomecollection-infra"
    key      = "build-state/router.tfstate"
    region   = "eu-west-1"
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 2.0"
  region  = "eu-west-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
  alias   = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}
