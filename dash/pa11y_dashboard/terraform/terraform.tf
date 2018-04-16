terraform {
  required_version = ">= 0.9"

  backend "s3" {
    key            = "build-state/pa11y_dashboard.tfstate"
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

module "pa11y_dashboard" {
  source     = "git::https://github.com/wellcometrust/terraform.git//ecs/service?ref=v8.0.2"
  name       = "pa11y_dashboard"
  cluster_id = "${local.cluster_name}"

  vpc_id = "${local.vpc_id}"

  task_definition_template_path      = "./task_definition.json.template"
  nginx_uri                          = "wellcome/nginx_webapp:latest"
  app_uri                            = "wellcome/pa11y_dashboard:latest"
  listener_https_arn                 = "${local.alb_listener_https_arn}"
  listener_http_arn                  = "${local.alb_listener_http_arn}"
  server_error_alarm_topic_arn       = "${module.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn       = "${module.alb_client_error_alarm.arn}"
  loadbalancer_cloudwatch_id         = "${local.alb_cloudwatch_id}"
  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"
  env_vars_length                    = 0
  desired_count                      = 2

  # (1024/2) - 128 (nginx) - 128 (app) = 256 (mongo)
  # (2000/2) - 128 (nginx) - 256 (app) = 616 (mongo)
  cpu = "128"

  memory                   = "256"
  primary_container_port   = "80"
  secondary_container_port = "3000"
  path_pattern             = "/pa11y_dashboard*"
  healthcheck_path         = "/management/healthcheck"
  alb_priority             = "11"
}

resource "aws_alb_listener_rule" "dash_https_path_rule" {
  listener_arn = "${local.alb_listener_https_arn}"
  priority     = "10"

  action {
    type             = "forward"
    target_group_arn = "${module.pa11y_dashboard.target_group_arn}"
  }

  condition {
    field  = "host-header"
    values = ["dash.wellcomecollection.org"]
  }
}

resource "aws_alb_listener_rule" "dash_http_path_rule" {
  listener_arn = "${local.alb_listener_http_arn}"
  priority     = "10"

  action {
    type             = "forward"
    target_group_arn = "${module.pa11y_dashboard.target_group_arn}"
  }

  condition {
    field  = "host-header"
    values = ["dash.wellcomecollection.org"]
  }
}
