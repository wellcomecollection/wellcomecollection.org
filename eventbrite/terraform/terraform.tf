terraform {
  required_version = ">= 0.11.1"

  backend "s3" {
    key            = "build-state/eventbrite.tfstate"
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

data "terraform_remote_state" "app_cluster" {
  backend = "s3"

  config {
    bucket = "wellcomecollection-infra"
    key    = "build-state/app_cluster.tfstate"
    region = "eu-west-1"
  }
}

data "aws_sns_topic" "alb_server_error_alarm" {
  name = "${module.alb_server_error_alarm.name}"
}

data "aws_sns_topic" "alb_client_error_alarm" {
  name = "${module.alb_client_error_alarm.name}"
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
