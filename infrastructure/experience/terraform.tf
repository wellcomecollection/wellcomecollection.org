terraform {
  backend "s3" {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"

    bucket         = "wellcomecollection-experience-infra"
    key            = "terraform/experience.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
  }
}

data "terraform_remote_state" "accounts_experience" {
  backend = "s3"

  config = {
    role_arn = "arn:aws:iam::760097843905:role/platform-read_only"
    bucket   = "wellcomecollection-platform-infra"
    key      = "terraform/aws-account-infrastructure/experience.tfstate"
    region   = "eu-west-1"
  }
}

locals {
  experience_vpcs = data.terraform_remote_state.accounts_experience.outputs
}
