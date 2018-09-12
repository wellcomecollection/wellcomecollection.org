module "whats_on" {
  source        = "git::https://github.com/wellcometrust/terraform.git//services?ref=v1.0.4"
  name          = "whats_on"
  cluster_id    = "${local.cluster_name}"
  task_role_arn = "${module.ecs_whats_on_iam.task_role_arn}"
  template_name = "default"
  vpc_id        = "${local.vpc_id}"
  nginx_uri     = "wellcome/wellcomecollection_whats_on_nginx:${var.container_tag}"
  app_uri       = "wellcome/wellcomecollection_whats_on_app:${var.container_tag}"

  listener_https_arn = "${local.alb_listener_https_arn}"
  listener_http_arn  = "${local.alb_listener_http_arn}"
  is_config_managed  = false
  alb_priority       = "300"

  desired_count = 2

  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"

  loadbalancer_cloudwatch_id = "${local.alb_cloudwatch_id}"

  server_error_alarm_topic_arn = "${module.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn = "${module.alb_client_error_alarm.arn}"

  # These account for the 128 mem and CPU the nginx container use
  # 995 is how much memmory is left once docker is running
  cpu = "384" # (1024/2) - 128

  memory                   = "369"  # (995/2) - 128
  primary_container_port   = "80"
  secondary_container_port = "3002"

  path_pattern = "/whats-on*"
}

# This is added as we want `/installation` and `/whats-on` to use this service
# This seems to break the concept of 1 URL per service in the modules,
# so didn't commit it there.
resource "aws_alb_listener_rule" "installations_http_path_rule" {
  listener_arn = "${local.alb_listener_http_arn}"
  priority     = "301"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "path-pattern"
    values = ["/installations*"]
  }
}
resource "aws_alb_listener_rule" "installations_https_path_rule" {
  listener_arn = "${local.alb_listener_https_arn}"
  priority     = "301"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "path-pattern"
    values = ["/installations*"]
  }
}

resource "aws_alb_listener_rule" "exhibitions_http_path_rule" {
  listener_arn = "${local.alb_listener_http_arn}"
  priority     = "302"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "path-pattern"
    values = ["/exhibitions*"]
  }
}
resource "aws_alb_listener_rule" "exhibitions_https_path_rule" {
  listener_arn = "${local.alb_listener_https_arn}"
  priority     = "302"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "path-pattern"
    values = ["/exhibitions*"]
  }
}

resource "aws_alb_listener_rule" "event_series_http_path_rule" {
  listener_arn = "${local.alb_listener_http_arn}"
  priority     = "303"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "path-pattern"
    values = ["/event-series*"]
  }
}
resource "aws_alb_listener_rule" "event_series_https_path_rule" {
  listener_arn = "${local.alb_listener_https_arn}"
  priority     = "303"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "path-pattern"
    values = ["/event-series*"]
  }
}

resource "aws_alb_listener_rule" "events_http_path_rule" {
  listener_arn = "${local.alb_listener_http_arn}"
  priority     = "304"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "path-pattern"
    values = ["/events*"]
  }
}
resource "aws_alb_listener_rule" "events_https_path_rule" {
  listener_arn = "${local.alb_listener_https_arn}"
  priority     = "304"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "path-pattern"
    values = ["/events*"]
  }
}

resource "aws_alb_listener_rule" "subdomain_http_path_rule" {
  listener_arn = "${local.alb_listener_http_arn}"
  priority     = "310"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "host-header"
    values = ["whats-on.wellcomecollection.org"]
  }
}
resource "aws_alb_listener_rule" "subdomain_https_path_rule" {
  listener_arn = "${local.alb_listener_https_arn}"
  priority     = "310"

  action {
    type             = "forward"
    target_group_arn = "${module.whats_on.target_group_arn}"
  }

  condition {
    field  = "host-header"
    values = ["whats-on.wellcomecollection.org"]
  }
}
