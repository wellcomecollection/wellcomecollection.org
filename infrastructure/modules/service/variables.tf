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

variable "nginx_image_name" {
  type = string
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

# Sidecar image tags are set centrally in platform-infrastructure/sidecars/terraform.
variable "sidecar_tier" {
  type = string

  validation {
    condition     = contains(["stage", "prod"], var.sidecar_tier)
    error_message = "sidecar_tier must be stage or prod."
  }
}

# Pins this service to a tag instead of the tier's parameter.
variable "fluentbit_tag_override" {
  type    = string
  default = null
}

variable "nginx_tag_override" {
  type    = string
  default = null
}
