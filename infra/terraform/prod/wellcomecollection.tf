provider "aws" {
  region  = "eu-west-1"
  version = "~> 1.0"
}

module "wellcomecollection" {
  source                = "../templates"
  project_name          = "wellcomecollection"
  ssl_cert_name         = "wellcomecollection.org"
  alb_log_bucket        = "wellcomecollection-logs"
  container_definitions = "${file("../container-definitions.json")}"
  infra_bucket          = "wellcomecollection-infra"
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
