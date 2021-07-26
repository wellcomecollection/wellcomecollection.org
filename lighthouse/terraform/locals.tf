locals {
  vpc_id          = local.experience_vpcs["experience_vpc_id"]
  private_subnets = local.experience_vpcs["experience_vpc_private_subnets"]
  public_subnets  = local.experience_vpcs["experience_vpc_public_subnets"]

  lhci_app_port  = 8888
  lhci_origin    = "lighthouse.wellcomecollection.org"
  hosted_zone_id = data.aws_route53_zone.zone.id
  vpc_cidr_block = data.aws_vpc.vpc.cidr_block
}

data "aws_route53_zone" "zone" {
  provider = aws.dns

  name = "wellcomecollection.org."
}

data "aws_vpc" "vpc" {
  id = local.vpc_id
}
