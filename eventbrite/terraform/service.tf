module "eventbrite" {
  source             = "git::https://github.com/wellcometrust/terraform.git//service?ref=v3.0.2"
  name               = "eventbrite"
  cluster_id         = "${local.cluster_name}"
  template_name      = "default"
  vpc_id             = "${local.vpc_id}"
  nginx_uri          = "wellcome/wellcomecollection_eventbrite_nginx:${var.container_tag}"
  app_uri            = "wellcome/wellcomecollection_eventbrite_app:${var.container_tag}"
  listener_https_arn = "${local.alb_listener_https_arn}"
  listener_http_arn  = "${local.alb_listener_http_arn}"
  is_config_managed  = false
  alb_priority       = "140"

  desired_count = 2

  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"

  loadbalancer_cloudwatch_id = "${local.alb_cloudwatch_id}"

  server_error_alarm_topic_arn = "${data.aws_sns_topic.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn = "${data.aws_sns_topic.alb_server_error_alarm.arn}"

  # These account for the 128 mem and CPU the nginx container use
  # 995 is how much memmory is left once docker is running
  cpu                      = "384" # (1024/2) - 128
  memory                   = "369" # (995/2) - 128
  primary_container_port   = "80"
  secondary_container_port = "3004"

  path_pattern = "/eventbrite/*"
  healthcheck_path = "/management/healthcheck"

  extra_vars = [
    "{\"name\" : \"EVENTBRITE_PERSONAL_OAUTH_TOKEN\", \"value\" : \"${var.eventbrite_personal_oauth_token}\"}"
  ]
}
