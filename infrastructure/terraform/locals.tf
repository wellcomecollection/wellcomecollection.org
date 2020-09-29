locals {
  vpc_id = local.experience_vpcs["experience_vpc_id"]

  private_subnets = local.experience_vpcs["experience_vpc_private_subnets"]
  public_subnets  = local.experience_vpcs["experience_vpc_public_subnets"]
  wc_org_cert_arn = "arn:aws:acm:eu-west-1:130871440101:certificate/6876e191-3f7a-47b7-9c67-40f45bb51b72"
}
