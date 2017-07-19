variable "project_name" {}
variable "wellcomecollection_ssl_cert_arn" {}
variable "container_tag" {}
variable "website_uri" {}
variable "container_definitions" {}
variable "container_definitions_thumbor" {}
variable "ssl_cert_name" {}
variable "alb_log_bucket" {}
variable "infra_bucket" {}

variable "alb_log_prefix" {
  default = "dotorg-alb"
}

variable "platform_team_account_id" {}
