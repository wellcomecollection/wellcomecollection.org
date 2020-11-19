module "catalogue-service-17092020" {
  source = "../../../infrastructure/terraform/modules/service"

  namespace = "catalogue-17092020-${var.env_suffix}"

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

  vpc_id  = local.vpc_id
  subnets = local.private_subnets

  deployment_service_name = "catalogue_webapp"
  deployment_service_env  = var.env_suffix
}

locals {
  target_group_arn = module.catalogue-service-17092020.target_group_arn
}

module "path_listener" {
  source = "../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = local.target_group_arn

  field    = "path-pattern"
  values   = ["/works*"]
  priority = "49997"
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source = "../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = local.target_group_arn

  priority = "201"
  values   = ["${var.subdomain}.wellcomecollection.org"]
  field    = "host-header"
}

module "embed_path_rule" {
  source = "../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = local.target_group_arn

  priority = "202"
  field    = "path-pattern"
  values   = ["/oembed*"]
}

module "images_search_rule" {
  source = "../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = local.target_group_arn

  priority = "203"
  field    = "path-pattern"
  values   = ["/images*"]
}

# We do this as our server side props for next.js are served over
# /_next/data/{hash}/{page}.json
# e.g. https://wellcomecollection.org/_next/data/dl7PfaUnoIXaQk0ol_5M8/works.json?query=things&source=search_form%2Fworks
# These routes will mimic the `/catalogue/webapp/pages/*` directory
# see: https://github.com/vercel/next.js/issues/16090

module "works_data_listener" {
  source = "../../../infrastructure/terraform/modules/alb_listener_rule"

  alb_listener_https_arn = var.alb_listener_https_arn
  alb_listener_http_arn  = var.alb_listener_http_arn
  target_group_arn       = local.target_group_arn

  field = "path-pattern"
  values = [
    "/_next/data/*/download.json",
    "/_next/data/*/embed.json",
    "/_next/data/*/image.json",
    "/_next/data/*/images.json",
    "/_next/data/*/item.json",
    "/_next/data/*/progress.json",
    "/_next/data/*/work.json",
    "/_next/data/*/works.json",
  ]
  priority = "49996"
}
