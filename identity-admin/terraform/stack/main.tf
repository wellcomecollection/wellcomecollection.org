module "identity-admin-service" {
  source = "../../../infrastructure/modules/service"

  namespace = "identity-admin-${var.env_suffix}"

  namespace_id = var.namespace_id
  cluster_arn  = var.cluster_arn

  healthcheck_path = "/management/healthcheck"

  container_image = var.container_image
  container_port  = 3000

  security_group_ids = [
    var.interservice_security_group_id,
    var.service_egress_security_group_id
  ]

  env_vars = {
    PROD_SUBDOMAIN = var.subdomain
  }

  vpc_id  = var.vpc_id
  subnets = var.private_subnets

  deployment_service_name = "catalogue_webapp"
  deployment_service_env  = var.env_suffix
}

locals {
  target_group_arn = module.identity-admin-service.target_group_arn
}

module "path_listener" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = local.target_group_arn

  path_patterns = ["*"]
  priority      = "49997"
}
