data "aws_ssm_parameter" "nginx_image_uri" {
  name = "/platform/images/latest/nginx_experience"
  provider = "aws.platform"
}

module "prod" {
  source = "./stack"

  namespace = "prod"

  vpc_id  = local.vpc_id
  subnets = local.public_subnets
}

module "content-prod" {
  source = "./modules/service"

  namespace    = "temporary-content-prod"

  namespace_id = module.prod.namespace_id
  cluster_arn  = module.prod.cluster_arn

  healthcheck_path = "/management/healthcheck"

  container_image = "wellcome/content_webapp:b991392217c35a675779e2e4838ed3d700bc76d1"
  container_port  = 3000

  nginx_container_image = data.aws_ssm_parameter.nginx_image_uri.value
  nginx_container_port  = 80

  env_vars = {
    dotdigital_username = "nope",
    dotdigital_password = "nope"
  }

  security_group_ids = [
    module.prod.interservice_security_group_id,
    module.prod.service_egress_security_group_id,
    module.prod.service_lb_ingress_security_group_id,
  ]

  vpc_id  = local.vpc_id
  subnets = local.private_subnets
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source                 = "./modules/alb_listener_rule"
  alb_listener_https_arn = module.prod.listener_https_arn
  alb_listener_http_arn  = module.prod.listener_http_arn

  target_group_arn = module.content-prod.target_group_arn
  priority         = "201"
  values           = ["works.wellcomecollection.org"]
}

module "embed_path_rule" {
  source                 = "./modules/alb_listener_rule"
  alb_listener_https_arn = module.prod.listener_https_arn
  alb_listener_http_arn  = module.prod.listener_http_arn

  target_group_arn = module.content-prod.target_group_arn
  priority         = "202"
  field            = "path-pattern"
  values           = ["/oembed*"]
}

module "images_search_rule" {
  source                 = "./modules/alb_listener_rule"
  alb_listener_https_arn = module.prod.listener_https_arn
  alb_listener_http_arn  = module.prod.listener_http_arn

  target_group_arn = module.content-prod.target_group_arn
  priority         = "203"
  field            = "path-pattern"
  values           = ["/images*"]
}
