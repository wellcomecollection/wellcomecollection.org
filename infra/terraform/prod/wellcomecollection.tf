provider "aws" {
  region  = "eu-west-1"
  version = "~> 1.0"
}

module "wellcomecollection" {
  source = "../templates"
}

output "vpc_id" {
  value = "${module.wellcomecollection.vpc_id}"
}

output "vpc_subnets" {
  value = "${module.wellcomecollection.vpc_subnets}"
}

output "https_sg_id" {
  value = "${module.wellcomecollection.https_sg_id}"
}
