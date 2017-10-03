module "router" {
  source             = "github.com/wellcometrust/platform//terraform/services"
  name               = "loris"
  cluster_id         = "${aws_ecs_cluster.router.id}"
  task_role_arn      = "${module.ecs_router_iam.task_role_arn}"
  template_name      = "nginx_standalone"
  vpc_id             = "${module.vpc_router.vpc_id}"
  nginx_uri          = "${var.nginx_uri}"
  listener_https_arn = "${module.router_alb.listener_https_arn}"
  listener_http_arn  = "${module.router_alb.listener_http_arn}"
  is_config_managed  = false
  alb_priority       = "100"

  desired_count = 2

  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"

  loadbalancer_cloudwatch_id   = "${module.router_alb.cloudwatch_id}"

  server_error_alarm_topic_arn = "${module.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn = "${module.alb_client_error_alarm.arn}"
}
