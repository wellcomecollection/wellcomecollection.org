module "content-service-23062020" {
  source = "../../../infrastructure/terraform/modules/service_23062020"

  namespace    = "content-23062020-${var.env_suffix}"

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

  secret_env_vars = {
    dotdigital_username = "content/dotdigital/username"
    dotdigital_password = "content/dotdigital/password"
  }

  vpc_id  = local.vpc_id
  subnets = local.private_subnets
}

locals {
  target_group_arn = module.content-service-23062020.target_group_arn
}

module "path_listener" {
  source = "../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = local.target_group_arn

  field                  = "path-pattern"
  values                 = ["/*"]
  priority               = "49998"
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source = "../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = local.target_group_arn

  field                  = "host-header"
  values                 = ["${var.subdomain}.wellcomecollection.org"]
  priority               = "49999"
}
