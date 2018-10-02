terraform {
  required_version = ">= 0.9"

  backend "s3" {
    key            = "build-state/content.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}

provider "aws" {
  version = "~> 1.10"
  region  = "eu-west-1"
}

provider "aws" {
  version = "~> 1.10"
  region  = "us-east-1"
  alias   = "us-east-1"
}

provider "random" {
  version = "~> 1.1"
}

provider "template" {
  version = "~> 1.0"
}

data "terraform_remote_state" "infra" {
  backend = "s3"

  config {
    bucket = "wellcomecollection-infra"
    key    = "terraform.tfstate"
    region = "eu-west-1"
  }
}

data "terraform_remote_state" "router" {
  backend = "s3"

  config {
    bucket = "wellcomecollection-infra"
    key    = "build-state/router.tfstate"
    region = "eu-west-1"
  }
}

locals {
  vpc_id                 = "${data.terraform_remote_state.infra.vpc_id}"
  vpc_subnets            = "${data.terraform_remote_state.infra.vpc_subnets}"
  alb_cloudwatch_id      = "${data.terraform_remote_state.infra.alb_cloudwatch_id}"
  alb_listener_https_arn = "${data.terraform_remote_state.router.alb_listener_https_arn}"
  alb_listener_http_arn  = "${data.terraform_remote_state.router.alb_listener_http_arn}"
  cluster_name           = "${data.terraform_remote_state.router.cluster_name}"
}

module "alb_server_error_alarm" {
  source = "git::https://github.com/wellcometrust/terraform.git//sns?ref=v7.0.1"
  name   = "alb_server_error_alarm"
}

module "alb_client_error_alarm" {
  source = "git::https://github.com/wellcometrust/terraform.git//sns?ref=v7.0.1"
  name   = "alb_client_error_alarm"
}

variable "container_tag" {}

module "content" {
  source     = "git::https://github.com/wellcometrust/terraform.git//ecs/service?ref=v7.0.1"
  name       = "content"
  cluster_id = "${local.cluster_name}"

  vpc_id = "${local.vpc_id}"

  nginx_uri                          = "wellcome/nginx_webapp:latest"
  app_uri                            = "wellcome/content_webapp:${var.container_tag}"
  listener_https_arn                 = "${local.alb_listener_https_arn}"
  listener_http_arn                  = "${local.alb_listener_http_arn}"
  server_error_alarm_topic_arn       = "${module.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn       = "${module.alb_client_error_alarm.arn}"
  loadbalancer_cloudwatch_id         = "${local.alb_cloudwatch_id}"
  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"
  env_vars_length                    = 0
  desired_count                      = 2
  cpu                                = "384"                                            # (1024/2) - 128
  memory                             = "369"                                            # (995/2) - 128
  primary_container_port             = "80"
  secondary_container_port           = "3000"
  host_name                          = "content.wellcomecollection.org"
  healthcheck_path                   = "/management/healthcheck"
  alb_priority                       = "700"
}

module "pages_listener" {
  source = "../../shared-infra/terraform/service_alb_listener"
  alb_listener_https_arn = "${local.alb_listener_https_arn}"
  alb_listener_http_arn = "${local.alb_listener_http_arn}"
  target_group_arn = "${module.content.target_group_arn}"
  priority = "100"
  path = "/pages/*"
}
module "visit_us_listener" {
  source = "../../shared-infra/terraform/service_alb_listener"
  alb_listener_https_arn = "${local.alb_listener_https_arn}"
  alb_listener_http_arn = "${local.alb_listener_http_arn}"
  target_group_arn = "${module.content.target_group_arn}"
  priority = "101"
  path = "/visit-us"
}
module "what_we_do_listener" {
  source = "../../shared-infra/terraform/service_alb_listener"
  alb_listener_https_arn = "${local.alb_listener_https_arn}"
  alb_listener_http_arn = "${local.alb_listener_http_arn}"
  target_group_arn = "${module.content.target_group_arn}"
  priority = "102"
  path = "/what-we-do"
}
module "press_listener" {
  source = "../../shared-infra/terraform/service_alb_listener"
  alb_listener_https_arn = "${local.alb_listener_https_arn}"
  alb_listener_http_arn = "${local.alb_listener_http_arn}"
  target_group_arn = "${module.content.target_group_arn}"
  priority = "103"
  path = "/press"
}
module "venue_hire_listener" {
  source = "../../shared-infra/terraform/service_alb_listener"
  alb_listener_https_arn = "${local.alb_listener_https_arn}"
  alb_listener_http_arn = "${local.alb_listener_http_arn}"
  target_group_arn = "${module.content.target_group_arn}"
  priority = "104"
  path = "/venue-hire"
}
module "access_listener" {
  source = "../../shared-infra/terraform/service_alb_listener"
  alb_listener_https_arn = "${local.alb_listener_https_arn}"
  alb_listener_http_arn = "${local.alb_listener_http_arn}"
  target_group_arn = "${module.content.target_group_arn}"
  priority = "105"
  path = "/access"
}
module "youth_listener" {
  source = "../../shared-infra/terraform/service_alb_listener"
  alb_listener_https_arn = "${local.alb_listener_https_arn}"
  alb_listener_http_arn = "${local.alb_listener_http_arn}"
  target_group_arn = "${module.content.target_group_arn}"
  priority = "106"
  path = "/youth"
}
module "schools_listener" {
  source = "../../shared-infra/terraform/service_alb_listener"
  alb_listener_https_arn = "${local.alb_listener_https_arn}"
  alb_listener_http_arn = "${local.alb_listener_http_arn}"
  target_group_arn = "${module.content.target_group_arn}"
  priority = "107"
  path = "/schools"
}
