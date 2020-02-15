variable "name" {
  description = "Name of the alarm"
}

variable "lb_dimension" {
  description = "LoadBalancer ARN Suffix"
}

variable "tg_dimension" {
  description = "TargetGroup ARN Suffix"
}

variable "topic_arn" {
  description = "SNS Topic to publish alarm state changes"
}

variable "enable_alarm" {
  type = bool
}

variable "metric" {}

variable "threshold" {
  default = 1
}

variable "comparison_operator" {
  default = "GreaterThanOrEqualToThreshold"
}

variable "treat_missing_data" {
  default = "missing"
}
