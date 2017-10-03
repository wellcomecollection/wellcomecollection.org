module "vpc_router" {
  source     = "github.com/wellcometrust/platform//terraform/network"
  cidr_block = "10.80.0.0/16"
  az_count   = "2"
  name       = "router"
}
