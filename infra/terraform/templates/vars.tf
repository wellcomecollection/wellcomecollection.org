variable "project_name" {}
variable "wellcomecollection_ssl_cert_arn" {}
variable "container_tag" {}
variable "container_definitions" {}
variable "ssl_cert_name" {}
variable "alb_log_bucket" {}
variable "infra_bucket" {}

variable "alb_log_prefix" {
  default = "dotorg-alb"
}

variable "platform_team_account_id" {}
