variable "interservice_security_group_id" {}
variable "service_egress_security_group_id" {}
variable "alb_listener_https_arn" {}
variable "alb_listener_http_arn" {}

module "catalogue-service" {
  source = "../../../../infrastructure/terraform/modules/service"

  namespace    = "catalogue-${var.env_suffix}"

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

  vpc_id  = local.vpc_id
  subnets = local.private_subnets
}

module "path_listener" {
  source = "../../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = module.catalogue-service.target_group_arn

  field                  = "path-pattern"
  values                 = ["/works*"]
  priority               = "49997"
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source = "../../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = module.catalogue-service.target_group_arn

  priority               = "201"
  values                 = [var.subdomain]
  field                  = "host-header"
}

module "embed_path_rule" {
  source = "../../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = module.catalogue-service.target_group_arn

  priority               = "202"
  field                  = "path-pattern"
  values                 = ["/oembed*"]
}

module "images_search_rule" {
  source = "../../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = module.catalogue-service.target_group_arn

  priority               = "203"
  field                  = "path-pattern"
  values                 = ["/images*"]
}
