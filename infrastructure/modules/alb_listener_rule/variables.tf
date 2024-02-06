variable "alb_listener_https_arn" {}
variable "alb_listener_http_arn" {
  type = string
  default = ""
}
variable "target_group_arn" {}
variable "priority" {}

variable "path_patterns" {
  type    = list(string)
  default = []
}

variable "host_headers" {
  type    = list(string)
  default = []
}

variable "cloudfront_header_secrets" {
  type    = list(string)
  default = []
}