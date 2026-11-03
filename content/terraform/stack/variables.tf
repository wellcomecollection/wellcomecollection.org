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

variable "env_suffix" {
  type = string
}

variable "subdomain" {
  type = string
}

variable "container_image" {
  type = string
}

variable "use_fargate_spot" {
  type    = bool
  default = false
}

variable "turn_off_outside_office_hours" {
  type    = bool
  default = false
}

variable "cloudfront_header_secrets" {
  type    = list(string)
  default = []
}

variable "desired_task_count" {
  type   = number
  default = 3
}

variable "app_user" {
  type    = string
  default = "nextjs"
}

variable "log_router_container_tag" {
  type    = string
  default = "0b9948b83bfb68e4481ed988f15ede80239e4879"
}
