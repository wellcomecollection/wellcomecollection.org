locals {
  vpc_id = local.experience_vpcs["experience_vpc_id"]
  public_subnets  = local.experience_vpcs["experience_vpc_public_subnets"]
}

data "aws_route53_zone" "zone" {
  provider = aws.dns

  name = "wellcomecollection.org."
}
