variable "environment" {
  type = object({
    cluster_arn  = string
    namespace_id = string
    listener_http_arn = string
    listener_https_arn = string
    interservice_security_group_id = string
    service_egress_security_group_id = string
  })
}

variable "env_suffix" {}

variable "subdomain" {}

variable "container_image" {}

variable "use_fargate_spot" {
  type    = bool
  default = false
}

variable "turn_off_outside_office_hours" {
  type    = bool
  default = false
}
