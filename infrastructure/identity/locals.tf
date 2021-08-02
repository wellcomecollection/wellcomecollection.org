locals {
  prod_identity_vpc_id = local.identity_vpcs["identity_prod_vpc_id"]
  prod_identity_private_subnets = local.identity_vpcs["identity_prod_vpc_private_subnets"]
  prod_identity_public_subnets  = local.identity_vpcs["identity_prod_vpc_public_subnets"]

  stage_identity_vpc_id = local.identity_vpcs["identity_stage_vpc_id"]
  stage_identity_private_subnets = local.identity_vpcs["identity_stage_vpc_private_subnets"]
  stage_identity_public_subnets  = local.identity_vpcs["identity_stage_vpc_public_subnets"]
}

data "aws_route53_zone" "zone" {
  provider = aws.dns_prod

  name = "wellcomecollection.org."
}
