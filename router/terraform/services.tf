module "router" {
  source             = "git::https://github.com/wellcometrust/terraform.git//services?ref=v1.0.0"
  name               = "router"
  cluster_id         = "${aws_ecs_cluster.router.id}"
  task_role_arn      = "${module.ecs_router_iam.task_role_arn}"
  template_name      = "nginx_standalone"
  vpc_id             = "${local.vpc_id}"
  nginx_uri          = "${var.nginx_uri}"
  listener_https_arn = "${module.router_alb.listener_https_arn}"
  listener_http_arn  = "${module.router_alb.listener_http_arn}"
  is_config_managed  = false
  alb_priority       = "100"

  desired_count = 2

  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"

  loadbalancer_cloudwatch_id   = "${module.router_alb.cloudwatch_id}"

  server_error_alarm_topic_arn = "${local.alb_server_error_alarm_arn}"
  client_error_alarm_topic_arn = "${local.alb_client_error_alarm_arn}"

  memory = "490"
  primary_container_port = "80"
}
