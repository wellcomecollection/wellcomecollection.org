resource "aws_lb_target_group" "http" {
  name                 = var.namespace
  port                 = var.nginx_container_port
  protocol             = "HTTP"
  vpc_id               = var.vpc_id
  deregistration_delay = 10
  target_type          = "ip"

  health_check {
    interval            = 10
    path                = var.healthcheck_path
    port                = var.nginx_container_port
    protocol            = "HTTP"
    timeout             = 5
    healthy_threshold   = 3
    unhealthy_threshold = 3
    matcher             = 200
  }

  lifecycle {
    create_before_destroy = true
  }
}

module "log_router_container" {
  source    = "git::github.com/wellcomecollection/terraform-aws-ecs-service.git//modules/firelens?ref=v2.6.1"
  namespace = var.namespace
}

module "log_router_container_secrets_permissions" {
  source    = "git::github.com/wellcomecollection/terraform-aws-ecs-service.git//modules/secrets?ref=v2.6.1"
  secrets   = module.log_router_container.shared_secrets_logging
  role_name = module.task_definition.task_execution_role_name
}

module "nginx_container" {
  source = "git::github.com/wellcomecollection/terraform-aws-ecs-service.git//modules/nginx/frontend?ref=v2.6.1"

  forward_port      = var.container_port
  log_configuration = module.log_router_container.container_log_configuration
}

module "app_container" {
  source = "git::github.com/wellcomecollection/terraform-aws-ecs-service.git//modules/container_definition?ref=v2.6.1"
  name   = "app"

  image = var.container_image

  environment = var.env_vars
  secrets     = var.secret_env_vars

  log_configuration = module.log_router_container.container_log_configuration
}

module "task_definition" {
  source = "git::github.com/wellcomecollection/terraform-aws-ecs-service.git//modules/task_definition?ref=v2.6.1"

  cpu    = var.app_cpu + var.nginx_cpu
  memory = var.app_memory + var.nginx_memory

  container_definitions = [
    module.log_router_container.container_definition,
    module.nginx_container.container_definition,
    module.app_container.container_definition
  ]

  task_name = var.namespace
}

module "service" {
  source = "git::github.com/wellcomecollection/terraform-aws-ecs-service.git//modules/service?ref=v2.6.1"

  cluster_arn  = var.cluster_arn
  service_name = var.namespace

  service_discovery_namespace_id = var.namespace_id

  task_definition_arn = module.task_definition.arn

  subnets            = var.subnets
  security_group_ids = var.security_group_ids

  desired_task_count = var.desired_task_count
  use_fargate_spot   = var.use_fargate_spot

  target_group_arn = aws_lb_target_group.http.arn

  container_name = "nginx"
  container_port = var.nginx_container_port
}
