variable "env_suffix" {}
variable "namespace_id" {}
variable "cluster_arn" {}

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

variable "deployment_service_name" {
  type        = string
  description = "Used by weco-deploy to determine which services to deploy, if unset the value used will be var.name"
  default     = ""
}

variable "deployment_service_env" {
  type        = string
  description = "Used by weco-deploy to determine which services to deploy in conjunction with deployment_service_name"
  default     = "prod"
}
