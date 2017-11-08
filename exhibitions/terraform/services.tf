module "exhibitions" {
  source             = "git::https://github.com/wellcometrust/terraform.git//services?ref=v1.0.4"
  name               = "exhibitions"
  cluster_id         = "${local.cluster_name}"
  task_role_arn      = "${module.ecs_exhibitions_iam.task_role_arn}"
  template_name      = "default"
  vpc_id             = "${local.vpc_id}"
  nginx_uri          = "wellcome/wellcomecollection-exhibitions-nginx:${var.nginx_docker_tag}"
  app_uri            = "wellcome/wellcomecollection-exhibitions-app:${var.nginx_docker_tag}"
  listener_https_arn = "${local.alb_listener_https_arn}"
  listener_http_arn  = "${local.alb_listener_http_arn}"
  is_config_managed  = false
  alb_priority       = "100"

  desired_count = 2

  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"

  loadbalancer_cloudwatch_id = "${local.alb_cloudwatch_id}"

  server_error_alarm_topic_arn = "${module.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn = "${module.alb_client_error_alarm.arn}"

  memory                   = "490"
  primary_container_port   = "80"
  secondary_container_port = "3000"

  path_pattern = "/exev"
}
