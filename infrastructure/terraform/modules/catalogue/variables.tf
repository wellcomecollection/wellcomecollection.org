variable "env_suffix" {}
variable "namespace_id" {}
variable "cluster_arn" {}

variable "service_secret_env_vars" {
  type    = map(string)
  default = {}
}
variable "service_env_vars" {
  type    = map(string)
  default = {}
}

variable "catalogue_subdomain" {}

variable "container_image" {}
variable "nginx_image_uri" {}

variable "security_group_ids" {
  type = list(string)
}

variable "listener_https_arn" {}
variable "listener_http_arn" {}
