module "alb_target_500_errors" {
  enable_alarm = var.enable_alb_alarm

  source = "./alb_alarm"
  name = "${var.service_name}-alb-target-500-errors"

  metric = "HTTPCode_Target_5XX_Count"
  topic_arn = var.server_error_alarm_topic_arn

  tg_dimension = aws_alb_target_group.ecs_service.arn_suffix
  lb_dimension = var.loadbalancer_cloudwatch_id
}

module "alb_target_400_errors" {
  enable_alarm = var.enable_alb_alarm

  source = "./alb_alarm"
  name = "${var.service_name}-alb-target-400-errors"

  metric = "HTTPCode_Target_4XX_Count"
  topic_arn = var.client_error_alarm_topic_arn

  tg_dimension = aws_alb_target_group.ecs_service.arn_suffix
  lb_dimension = var.loadbalancer_cloudwatch_id
}

module "unhealthy_hosts_alarm" {
  enable_alarm = var.enable_alb_alarm

  source = "./alb_alarm"
  name = "${var.service_name}-alb-unhealthy-hosts"

  metric = "UnHealthyHostCount"
  topic_arn = var.server_error_alarm_topic_arn

  tg_dimension = aws_alb_target_group.ecs_service.arn_suffix
  lb_dimension = var.loadbalancer_cloudwatch_id
}

locals {
  healthy_host_threshold = var.deployment_minimum_healthy_percent * var.desired_count / 100.0
}

module "healthy_hosts_alarm" {
  # The rule here is: if we have less than the minimum percent of
  # healthy hosts, we should alarm.
  #
  # If this is zero (i.e. it's okay to go down to no running hosts), we don't
  # alarm --- this is not an uptime-critical service.
  enable_alarm = var.enable_alb_alarm

  source = "./alb_alarm"
  name = "${var.service_name}-alb-not-enough-healthy-hosts"

  comparison_operator = "LessThanThreshold"
  metric = "HealthyHostCount"
  topic_arn = var.server_error_alarm_topic_arn

  threshold = local.healthy_host_threshold

  # There have been scenarios where HealthyHostCount doesn't report any data
  # (e.g. when an invalid container definition was pushed).  In this case,
  # we still want an alarm!  So if we don't have data, assume something is up.
  treat_missing_data = "breaching"

  tg_dimension = aws_alb_target_group.ecs_service.arn_suffix
  lb_dimension = var.loadbalancer_cloudwatch_id
}
