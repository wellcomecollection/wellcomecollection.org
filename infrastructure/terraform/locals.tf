locals {
  vpc_id = data.terraform_remote_state.infra_shared.outputs.experience_vpc_id

  private_subnets = data.terraform_remote_state.infra_shared.outputs.experience_vpc_private_subnets
  public_subnets  = data.terraform_remote_state.infra_shared.outputs.experience_vpc_public_subnets
  wc_org_cert_arn = "arn:aws:acm:eu-west-1:130871440101:certificate/6876e191-3f7a-47b7-9c67-40f45bb51b72"
}
