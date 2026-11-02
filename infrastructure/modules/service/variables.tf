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
  type    = bool
  default = false
}

variable "turn_off_outside_office_hours" {
  type    = bool
  default = false
}

variable "allow_scaling_to_zero" {
  description = "Whether to allow this service to scale to zero (causing an outage) during deployments"
  type        = bool
  default     = false
}

variable "nginx_memory_reservation" {
  type    = number
  default = 50

}

variable "app_user" {
  description = "User the app container runs as; the ECS module defaults to root, overriding the image's USER"
  type        = string
  default     = "0"
}

# The fluentbit image in platform-infrastructure/images/dockerfiles/fluentbit.
variable "log_router_container_tag" {
  type    = string
  default = "e0fd0a21b26600e07ca0748bd64819f058d5e40c"
}
