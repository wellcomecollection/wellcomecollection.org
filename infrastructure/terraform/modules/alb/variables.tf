variable "name" {
  description = "Name of ALB"
}

variable "subnets" {
  type = list(string)
  description = "subnets to which ALB will route"
}

variable "security_groups" {
  type = list(string)
  description = "Load balancer security group ID"
}

variable "cert_arn" {
  description = "ARN of the associated ACM certificate"
}

variable "health_check_path" {
  default = "/management/healthcheck"
}

variable "vpc_id" {
  description = "ID of VPC to create ALB in"
}
