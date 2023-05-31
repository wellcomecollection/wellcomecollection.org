module "identity-service-18012021" {
  source = "../../../infrastructure/modules/service"

  namespace = "identity-18012021-${var.env_suffix}"

  namespace_id = var.environment["namespace_id"]
  cluster_arn  = var.environment["cluster_arn"]

  healthcheck_path = "/management/healthcheck"

  container_image = var.container_image
  container_port  = 3000

  cpu    = var.env_suffix == "prod" ? 512 : 256
  memory = var.env_suffix == "prod" ? 1024 : 512

  security_group_ids = [
    var.environment["interservice_security_group_id"],
    var.environment["service_egress_security_group_id"]
  ]

  env_vars = merge({
    PROD_SUBDOMAIN  = var.subdomain
    APM_ENVIRONMENT = var.env_suffix
  }, var.env_vars)

  secret_env_vars = merge({
    PRISMIC_ACCESS_TOKEN = "prismic-model/prod/access-token"
  }, var.secret_env_vars)

  # We have a custom nginx container that redacts the values of
  # sensitive query parameters, e.g. email, to avoid leaking PII
  # into the shared logging cluster.
  nginx_container_config = {
    image_name    = "uk.ac.wellcome/nginx_frontend_identity"
    container_tag = "39d58d9252e68c954e85323f3ac07eb3c0f580e8"
  }

  vpc_id  = local.vpc_id
  subnets = local.private_subnets

  allow_scaling_to_zero = var.env_suffix != "prod"
}

locals {
  target_group_arn = module.identity-service-18012021.target_group_arn
}

module "path_listener" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  path_patterns = ["/account*"]
  priority      = "49994"
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  priority     = "301"
  host_headers = ["${var.subdomain}.wellcomecollection.org"]
}

# We do this as our server side props for next.js are served over
# /_next/data/{hash}/{page}.json
# e.g. https://wellcomecollection.org/_next/data/dl7PfaUnoIXaQk0ol_5M8/identity.json
# These routes will mimic the `/identity/webapp/pages/*` directory
# see: https://github.com/vercel/next.js/issues/16090

locals {
  # Listener rules are limited to 5 different condition values so we
  # must create several to cover all of the path patterns we need

  identity_data_paths = [
    "/_next/data/*/account/*.json",
  ]
  max_conditions_per_rule = 5

  identity_data_path_chunks = chunklist(local.identity_data_paths, local.max_conditions_per_rule)
  identity_data_path_sets = zipmap(
    range(length(local.identity_data_path_chunks)),
    local.identity_data_path_chunks
  )

  max_priority = 48996
  min_priority = local.max_priority - length(local.identity_data_path_chunks) + 1
}

module "identity_data_listener" {
  source   = "../../../infrastructure/modules/alb_listener_rule"
  for_each = local.identity_data_path_sets

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  path_patterns = each.value
  priority      = local.min_priority + each.key
}
