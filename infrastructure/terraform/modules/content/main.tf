module "content-service" {
  source = "../service"

  namespace    = "content-${var.env_suffix}"

  namespace_id = var.namespace_id
  cluster_arn  = var.cluster_arn

  healthcheck_path = "/management/healthcheck"

  container_image = var.container_image
  container_port  = 3000

  nginx_container_image = var.nginx_image_uri
  nginx_container_port  = 80

  secret_env_vars = var.service_secret_env_vars
  env_vars        = var.service_env_vars

  security_group_ids = var.security_group_ids

  vpc_id  = local.vpc_id
  subnets = local.private_subnets
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source                 = "../alb_listener_rule"
  alb_listener_https_arn = var.listener_https_arn
  alb_listener_http_arn  = var.listener_http_arn
  target_group_arn       = module.content-service.target_group_arn
  priority               = "49999"
  values                 = [var.content_subdomain]
}
