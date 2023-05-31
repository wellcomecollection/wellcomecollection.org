module "content-service-17092020" {
  source = "../../../infrastructure/modules/service"

  namespace = "content-17092020-${var.env_suffix}"

  namespace_id = var.environment["namespace_id"]
  cluster_arn  = var.environment["cluster_arn"]

  healthcheck_path = "/management/healthcheck"

  container_image = var.container_image
  container_port  = 3000

  security_group_ids = [
    var.environment["interservice_security_group_id"],
    var.environment["service_egress_security_group_id"]
  ]

  env_vars = {
    PROD_SUBDOMAIN  = var.subdomain
    APM_ENVIRONMENT = var.env_suffix
  }

  secret_env_vars = {
    APM_SERVER_URL      = "elasticsearch/logging/apm_server_url"
    APM_SECRET          = "elasticsearch/logging/apm_secret"
    dotdigital_username = "content/dotdigital/username"
    dotdigital_password = "content/dotdigital/password"

    PRISMIC_ACCESS_TOKEN = "prismic-model/prod/access-token"
  }

  vpc_id  = local.vpc_id
  subnets = local.private_subnets
}

locals {
  target_group_arn = module.content-service-17092020.target_group_arn
}

module "path_listener" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  path_patterns = ["/*"]
  priority      = "49998"
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  host_headers = ["${var.subdomain}.wellcomecollection.org"]
  priority     = "49999"
}
