locals {
  vpc_id          = local.experience_vpcs["experience_vpc_id"]
  private_subnets = local.experience_vpcs["experience_vpc_private_subnets"]
  public_subnets  = local.experience_vpcs["experience_vpc_public_subnets"]

  lhci_app_port = 8888
}
