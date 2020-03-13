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
