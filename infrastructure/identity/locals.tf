locals {
  vpc_id = local.experience_vpcs["experience_vpc_id"]
  private_subnets = local.experience_vpcs["experience_vpc_private_subnets"]
  public_subnets  = local.experience_vpcs["experience_vpc_public_subnets"]

  // Hand-crafted original cert for experience account
  wc_org_cert_arn = "arn:aws:acm:eu-west-1:130871440101:certificate/6876e191-3f7a-47b7-9c67-40f45bb51b72"

  identity_vpc_id = local.identity_vpcs["identity_vpc_id"]
  identity_private_subnets = local.identity_vpcs["identity_vpc_private_subnets"]
  identity_public_subnets  = local.identity_vpcs["identity_vpc_public_subnets"]
}

data "aws_route53_zone" "zone" {
  provider = aws.dns

  name = "wellcomecollection.org."
}
