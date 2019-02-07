variable "project_name" {}
variable "container_definitions" {}
variable "ssl_cert_name" {}
variable "alb_log_bucket" {}
variable "infra_bucket" {}

variable "alb_log_prefix" {
  default = "dotorg-alb"
}
