locals {
  identity_vpc_id = local.identity_vpcs["identity_vpc_id"]
  identity_private_subnets = local.identity_vpcs["identity_vpc_private_subnets"]
  identity_public_subnets  = local.identity_vpcs["identity_vpc_public_subnets"]
}

data "aws_route53_zone" "zone" {
  provider = aws.dns

  name = "wellcomecollection.org."
}
