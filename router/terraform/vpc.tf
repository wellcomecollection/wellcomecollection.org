module "vpc_router" {
  source     = "git::https://github.com/wellcometrust/terraform.git//terraform/network?ref=v1.0.0"
  cidr_block = "10.80.0.0/16"
  az_count   = "2"
  name       = "router"
}
