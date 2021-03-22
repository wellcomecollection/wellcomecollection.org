data "aws_caller_identity" "current" {}

terraform {
  required_version = ">= 0.9"

  backend "s3" {
    role_arn = "arn:aws:iam::770700576653:role/identity-developer"

    bucket         = "wellcomecollection-identity-experience-infra"
    key            = "terraform/identity-experience.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
  }
}

data "terraform_remote_state" "accounts_experience" {
  backend = "s3"

  config = {
    role_arn = "arn:aws:iam::760097843905:role/platform-read_only"
    bucket   = "wellcomecollection-platform-infra"
    key      = "terraform/platform-infrastructure/accounts/experience.tfstate"
    region   = "eu-west-1"
  }
}

data "terraform_remote_state" "accounts_identity" {
  backend = "s3"

  config = {
    role_arn = "arn:aws:iam::760097843905:role/platform-read_only"
    bucket   = "wellcomecollection-platform-infra"
    key      = "terraform/platform-infrastructure/accounts/identity.tfstate"
    region   = "eu-west-1"
  }
}

locals {
  experience_vpcs = data.terraform_remote_state.accounts_experience.outputs
  identity_vpcs = data.terraform_remote_state.accounts_identity.outputs
}
