locals {
  vpc_id = data.terraform_remote_state.infra_shared.outputs.experience_vpc_id

  private_subnets = data.terraform_remote_state.infra_shared.outputs.experience_vpc_private_subnets

  civicuk_api_key = data.aws_secretsmanager_secret_version.civicuk.secret_string
}
