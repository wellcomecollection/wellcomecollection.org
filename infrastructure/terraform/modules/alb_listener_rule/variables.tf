variable "alb_listener_https_arn" {}
variable "alb_listener_http_arn" {}
variable "target_group_arn" {}
variable "priority" {}

variable "values" {
  type = list(string)
}

variable "field" {
  default = "host-header"
}
