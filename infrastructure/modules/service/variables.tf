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
