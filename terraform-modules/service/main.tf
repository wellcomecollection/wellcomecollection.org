locals {
  default_healthcheck_path = "/management/healthcheck"
  fallback_healthcheck_path = replace(var.path_pattern, "/*", local.default_healthcheck_path)
  healthcheck_path = var.healthcheck_path == "" ? local.fallback_healthcheck_path : var.healthcheck_path
}

module "service" {
  source = "./ecs_service"
  service_name = var.name
  cluster_id = var.cluster_id
  task_definition_arn = module.task.arn
  vpc_id = var.vpc_id
  container_name = var.primary_container_name
  container_port = var.primary_container_port
  listener_https_arn = var.listener_https_arn
  listener_http_arn = var.listener_http_arn
  path_pattern = var.path_pattern
  alb_priority = var.alb_priority
  desired_count = var.desired_count
  healthcheck_path = local.healthcheck_path
  host_name = var.host_name

  client_error_alarm_topic_arn = var.client_error_alarm_topic_arn
  server_error_alarm_topic_arn = var.server_error_alarm_topic_arn
  loadbalancer_cloudwatch_id = var.loadbalancer_cloudwatch_id

  deployment_minimum_healthy_percent = var.deployment_minimum_healthy_percent
  deployment_maximum_percent = var.deployment_maximum_percent

  enable_alb_alarm = var.enable_alb_alarm
}

module "task" {
  source = "./ecs_task"
  name = var.name

  volume_name = var.volume_name
  volume_host_path = var.volume_host_path

  app_uri = var.app_uri
  nginx_uri = var.nginx_uri

  cpu = var.cpu
  memory = var.memory

  primary_container_port = var.primary_container_port
  secondary_container_port = var.secondary_container_port
  container_path = var.container_path

  service_vars = {
    HTTPS_DOMAIN = var.https_domain
    APP_PORT = var.secondary_container_port
    NGINX_PORT = var.primary_container_port
  }

  config_vars = var.env_vars
  config_vars_length = var.env_vars_length

  log_group_name_prefix = var.log_group_name_prefix
}
