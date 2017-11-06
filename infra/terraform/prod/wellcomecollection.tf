variable "wellcomecollection_ssl_cert_arn" {}

variable "container_tag" {}

variable "platform_team_account_id" {}

provider "aws" {
  region     = "eu-west-1"
  version = "~> 1.0"
}

module "wellcomecollection" {
  source                          = "../templates"
  project_name                    = "wellcomecollection"
  ssl_cert_name                   = "wellcomecollection.org"
  alb_log_bucket                  = "wellcomecollection-logs"
  container_definitions           = "${file("../container-definitions.json")}"
  wellcomecollection_ssl_cert_arn = "${var.wellcomecollection_ssl_cert_arn}"
  container_tag                   = "${var.container_tag}"
  platform_team_account_id        = "${var.platform_team_account_id}"
  infra_bucket                    = "wellcomecollection-infra"
}

output "vpc_id" {
  value = "${module.wellcomecollection.vpc_id}"
}

output "vpc_subnets" {
  value = "${module.wellcomecollection.vpc_subnets}"
}

output "ami_id" {
  value = "${module.wellcomecollection.ami_id}"
}

output "alb_listener_https_arn" {
  value = "${module.wellcomecollection.alb_listener_https_arn}"
}

output "alb_listener_http_arn" {
  value = "${module.wellcomecollection.alb_listener_http_arn}"
}

output "alb_cloudwatch_id" {
  value = "${module.wellcomecollection.alb_cloudwatch_id}"
}
