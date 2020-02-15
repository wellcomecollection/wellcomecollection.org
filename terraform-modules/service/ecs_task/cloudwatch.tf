resource "aws_cloudwatch_log_group" "task" {
  name = "${var.log_group_name_prefix}/${var.name}"
}

resource "aws_cloudwatch_log_group" "nginx_task" {
  name = "${var.log_group_name_prefix}/nginx_${var.name}"
}
