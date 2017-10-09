module "dot_org" {
  source             = "git::https://github.com/wellcometrust/terraform.git//services?ref=v1.0.0"
  name               = "miro_reindexer"
  cluster_id         = "${aws_ecs_cluster.dot_org.id}"
  task_role_arn      = "${module.ecs_dot_org_iam.task_role_arn}"
  vpc_id             = "${local.vpc_id}"
  app_uri            = "wellcome/wellcomecollection:${var.container_tag}"
  nginx_uri          = "wellcome/wellcomecollection-nginx-proxy:${var.container_tag}"
  listener_https_arn = "${module.dot_org_alb.listener_https_arn}"
  listener_http_arn  = "${module.dot_org_alb.listener_http_arn}"
  path_pattern       = "/miro_reindexer/*"
  alb_priority       = "104"
  healthcheck_path   = "/miro_reindexer/management/healthcheck"
  infra_bucket       = "${var.infra_bucket}"
  config_key         = "config/${var.build_env}/miro_reindexer.ini"

  cpu    = 512
  memory = 1024

  desired_count = "2"

  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"

  loadbalancer_cloudwatch_id   = "${module.dot_org_alb.cloudwatch_id}"

  server_error_alarm_topic_arn = "${local.alb_server_error_alarm_arn}"
  client_error_alarm_topic_arn = "${var.alb_client_error_alarm_arn}"
}
