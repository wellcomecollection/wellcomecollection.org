variable "subnets" {
  type = list(string)
}

variable "cluster_arn" {}

variable "namespace" {}
variable "namespace_id" {
  default = null
}

variable "vpc_id" {}

variable "container_image" {}
variable "container_port" {
  type = number
}

variable "nginx_container_config" {
  type = object({
    image_name    = string
    container_tag = string
  })

  // This has an increased max request body size, and increased proxy buffer sizes
  default = {
    image_name    = "uk.ac.wellcome/nginx_frontend"
    container_tag = "9b95057b716a60f9891f77111b0bd524b85839aa"
  }
}

variable "security_group_ids" {
  type = list(string)
}

variable "env_vars" {
  type    = map(string)
  default = {}
}

variable "secret_env_vars" {
  type    = map(string)
  default = {}
}

variable "cpu" {
  default = 1024
  type    = number
}

variable "memory" {
  default = 2048
  type    = number
}

variable "desired_task_count" {
  default = 3
}

variable "healthcheck_path" {}

variable "use_fargate_spot" {
  default = false
}

variable "allow_scaling_to_zero" {
  description = "Whether to allow this service to scale to zero (causing an outage) during deployments"
  type        = bool
  default     = false
}
