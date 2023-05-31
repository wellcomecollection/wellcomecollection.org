variable "environment" {
  type = object({
    cluster_arn  = string
    namespace_id = string
  })
}

variable "env_suffix" {}

variable "interservice_security_group_id" {}
variable "service_egress_security_group_id" {}
variable "alb_listener_https_arn" {}
variable "alb_listener_http_arn" {}

variable "subdomain" {}

variable "container_image" {}
variable "nginx_image" {}

variable "aws_region" {
  default = "eu-west-1"
}
