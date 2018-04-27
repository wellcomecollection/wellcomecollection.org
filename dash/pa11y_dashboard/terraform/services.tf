module "pa11y_dashboard" {
  source     = "git::https://github.com/wellcometrust/terraform.git//ecs/service?ref=e69f626477700c82e6fd9cb3dd729ef027110434"
  name       = "pa11y_dashboard"
  cluster_id = "${local.cluster_name}"
  vpc_id     = "${local.vpc_id}"
  nginx_uri  = "wellcome/nginx_webapp:latest"
  app_uri    = "wellcome/pa11y_dashboard"

  listener_https_arn = "${local.alb_listener_https_arn}"
  listener_http_arn  = "${local.alb_listener_http_arn}"

  alb_priority = "200"

  desired_count   = 2
  env_vars_length = 0

  task_definition_template_path = "./task_definition.json.template"

  deployment_minimum_healthy_percent = "50"
  deployment_maximum_percent         = "200"

  loadbalancer_cloudwatch_id = "${local.alb_cloudwatch_id}"

  server_error_alarm_topic_arn = "${module.alb_server_error_alarm.arn}"
  client_error_alarm_topic_arn = "${module.alb_client_error_alarm.arn}"

  # These account for the 128 mem and CPU the nginx container use
  # 995 is how much memmory is left once docker is running
  # We also use some of this for mongo
  cpu = "256" # (1024/2) - 128 (nginx) - 128 (mongo)

  memory                   = "241"  # (995/2) - 128 (nginx) - 128 (mongo)
  primary_container_port   = "80"
  secondary_container_port = "3000"

  healthcheck_path = "/management/healthcheck"
  path_pattern     = "/pa11y*"
}
