variable "alb_listener_https_arn" {}
variable "alb_listener_http_arn" {}
variable "target_group_arn" {}
variable "priority" {}

variable "values" {
  type = "list"
}

variable "field" {
  default = "host-header"
}

resource "aws_alb_listener_rule" "https" {
  listener_arn = "${var.alb_listener_https_arn}"
  priority     = "${var.priority}"

  action {
    type             = "forward"
    target_group_arn = "${var.target_group_arn}"
  }

  condition {
    field  = "${var.field}"
    values = "${var.values}"
  }
}

resource "aws_alb_listener_rule" "http" {
  listener_arn = "${var.alb_listener_http_arn}"
  priority     = "${var.priority}"

  action {
    type             = "forward"
    target_group_arn = "${var.target_group_arn}"
  }

  condition {
    field  = "${var.field}"
    values = "${var.values}"
  }
}
