data "aws_caller_identity" "current" {}

terraform {
  required_version = ">= 0.9"

  backend "s3" {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"

    bucket         = "wellcomecollection-experience-infra"
    key            = "terraform/experience.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
  }
}

data "terraform_remote_state" "infra_shared" {
  backend = "s3"

  config = {
    role_arn = "arn:aws:iam::760097843905:role/platform-read_only"
    bucket   = "wellcomecollection-platform-infra"
    key      = "terraform/platform-infrastructure/shared.tfstate"
    region   = "eu-west-1"
  }
}

locals {
  vpc_id = data.terraform_remote_state.infra_shared.outputs.experience_vpc_id

  private_subnets = data.terraform_remote_state.infra_shared.outputs.experience_vpc_private_subnets
  public_subnets = data.terraform_remote_state.infra_shared.outputs.experience_vpc_public_subnets
}
