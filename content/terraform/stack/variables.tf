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
variable "nginx_image" {
  type = string
}
