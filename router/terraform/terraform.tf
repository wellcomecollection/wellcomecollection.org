terraform {
  required_version = ">= 0.11"

  backend "s3" {
    key            = "build-state/router.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
    role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

data "terraform_remote_state" "wellcomecollection" {
  backend = "s3"

  config {
    bucket   = "wellcomecollection-infra"
    key      = "terraform.tfstate"
    region   = "eu-west-1"
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 2.6.0"
  region  = "eu-west-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 2.6.0"
  region  = "us-east-1"
  alias   = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

output "cluster_name" {
  value = "${aws_ecs_cluster.router.name}"
}

output "alb_listener_https_arn" {
  value = "${module.router_alb.listener_https_arn}"
}

output "alb_listener_http_arn" {
  value = "${module.router_alb.listener_http_arn}"
}

output "alb_id" {
  value = "${module.router_alb.id}"
}

output "alb_dns_name" {
  value = "${module.router_alb.dns_name}"
}
