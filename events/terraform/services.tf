module "events" {
  source             = "git::https://github.com/wellcometrust/terraform.git//services?ref=v1.0.4"
  name               = "events"
  cluster_id         = "${local.cluster_name}"
  task_role_arn      = "${module.ecs_events_iam.task_role_arn}"
  template_name      = "default"
  vpc_id             = "${local.vpc_id}"
  nginx_uri          = "wellcome/wellcomecollection_events_nginx:${var.container_tag}"
  app_uri            = "wellcome/wellcomecollection_events_webapp:${var.container_tag}"

  listener_https_arn = "${local.alb_listener_https_arn}"
  listener_http_arn  = "${local.alb_listener_http_arn}"
  is_config_managed  = false
  alb_priority       = "110"

  desired_count = 2

  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"

  loadbalancer_cloudwatch_id = "${local.alb_cloudwatch_id}"

  server_error_alarm_topic_arn = "${module.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn = "${module.alb_client_error_alarm.arn}"

  # These account for the 128 mem and CPU the nginx container use
  # 995 is how much memmory is left once docker is running
  cpu                      = "384" # (1024/2) - 128
  memory                   = "369" # (995/2) - 128
  primary_container_port   = "80"
  secondary_container_port = "3002"

  path_pattern = "/events*"
}
