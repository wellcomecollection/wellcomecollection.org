terraform {
  required_version = ">= 0.9"

  backend "s3" {
    key            = "build-state/app_cluster.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}

data "terraform_remote_state" "infra" {
  backend = "s3"

  config {
    bucket = "wellcomecollection-infra"
    key    = "terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  version = "~> 1.0"
  region  = "eu-west-1"
}

provider "aws" {
  version = "~> 1.0"
  region  = "us-east-1"
  alias   = "us-east-1"
}

output "cluster_name" {
  value = "${aws_ecs_cluster.app_cluster.name}"
}

output "loadbalancer_sg_https_id" {
  value = "${module.app_cluster_asg.loadbalancer_sg_https_id}"
}
