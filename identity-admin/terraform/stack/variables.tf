variable "env_suffix" {
  type = string
}
variable "namespace_id" {
  type = string
}
variable "cluster_arn" {
  type = string
}
variable "container_image" {
  type = string
}
variable "interservice_security_group_id" {
  type = string
}
variable "service_egress_security_group_id" {
  type = string
}
variable "subdomain" {
  type = string
}
variable "vpc_id" {
  type = string
}
variable "private_subnets" {
  type = list(string)
}
variable "alb_listener_https_arn" {
  type = string
}
variable "alb_listener_http_arn" {
  type = string
}
variable "env_vars" {
  type = map(string)
  default = {}
}

variable "secret_env_vars" {
  type = map(string)
  default = {}
}
