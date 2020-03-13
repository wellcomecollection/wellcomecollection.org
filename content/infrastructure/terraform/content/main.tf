variable "interservice_security_group_id" {}
variable "service_egress_security_group_id" {}
variable "alb_listener_https_arn" {}
variable "alb_listener_http_arn" {}

module "content-service" {
  source = "../../../../infrastructure/terraform/modules/service"

  namespace    = "content-${var.env_suffix}"

  namespace_id = var.namespace_id
  cluster_arn  = var.cluster_arn

  healthcheck_path = "/management/healthcheck"

  container_image = var.container_image
  container_port  = 3000

  nginx_container_image = data.aws_ssm_parameter.nginx_image_uri.value
  nginx_container_port  = 80

  security_group_ids = [
    var.interservice_security_group_id,
    var.service_egress_security_group_id
  ]

  secret_env_vars = {
    dotdigital_username = "content/dotdigital/username"
    dotdigital_password = "content/dotdigital/password"
  }

  vpc_id  = local.vpc_id
  subnets = local.private_subnets
}


module "path_listener" {
  source = "../../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = module.content-service.target_group_arn

  field                  = "path-pattern"
  values                 = ["/*"]
  priority               = "49998"
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source = "../../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = module.content-service.target_group_arn

  field                  = "host-header"
  values                 = [var.subdomain]
  priority               = "49999"
}
