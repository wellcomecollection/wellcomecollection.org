module "catalogue-service-17092020" {
  source = "../../../infrastructure/modules/service"

  namespace = "catalogue-17092020-${var.env_suffix}"

  namespace_id = var.environment["namespace_id"]
  cluster_arn  = var.environment["cluster_arn"]

  healthcheck_path = "/management/healthcheck"

  container_image = var.container_image
  container_port  = 3000

  security_group_ids = [
    var.environment["interservice_security_group_id"],
    var.environment["service_egress_security_group_id"]
  ]

  # Note: in September 2022, we were running with 0.5 vCPU and 1 GB of memory;
  # we saw occasionally failures where the memory would spike to 100%
  # and the app would crash.
  #
  # We're increasing it to 2 GB to see if that improves reliability.
  #
  # Note 2: in November 2022, we were running with 0.5 vCPUs and 2gb of memory;
  # we saw latency spikes and CPUUtilization maxima often in the 80-100% region.
  # These would occasionally result in 502s and so on.
  #
  # We're increasing vCPU to 1 in prod to see if this is addressed
  cpu    = var.env_suffix == "prod" ? 1024 : 512
  memory = var.env_suffix == "prod" ? 2048 : 1024

  env_vars = {
    PROD_SUBDOMAIN  = var.subdomain
    APM_ENVIRONMENT = var.env_suffix
  }

  secret_env_vars = {
    APM_SERVER_URL       = "elasticsearch/logging/apm_server_url"
    APM_SECRET           = "elasticsearch/logging/apm_secret"
    items_api_key_prod   = "catalogue_api/items/prod/api_key"
    items_api_key_stage  = "catalogue_api/items/stage/api_key"

    PRISMIC_ACCESS_TOKEN = "prismic-model/prod/access-token"
    PRISMIC_BEARER_TOKEN = "prismic-model/graphql/prismic_bearer_token"
  }

  vpc_id  = local.vpc_id
  subnets = local.private_subnets

  allow_scaling_to_zero = var.env_suffix != "prod"

  use_fargate_spot              = var.use_fargate_spot
  turn_off_outside_office_hours = var.turn_off_outside_office_hours
}

locals {
  target_group_arn = module.catalogue-service-17092020.target_group_arn
}

module "path_listener" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  path_patterns = ["/works*"]
  priority      = "49997"
}

module "api_path_listener" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  path_patterns = ["/api/works*"]
  priority      = "49000"
}

# This is used for the static assets served from _next with multiple next apps
# See: https://github.com/zeit/next.js#multi-zones
module "subdomain_listener" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  priority     = "201"
  host_headers = ["${var.subdomain}.wellcomecollection.org"]
}

module "embed_path_rule" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  priority      = "202"
  path_patterns = ["/oembed*"]
}

module "images_search_rule" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  priority      = "203"
  path_patterns = ["/images*"]
}

module "concepts_search_rule" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  priority      = "204"
  path_patterns = ["/concepts*"]
}

module "search_rule" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  priority      = "205"
  path_patterns = ["/search*"]
}

# We do this as our server side props for next.js are served over
# /_next/data/{hash}/{page}.json
# e.g. https://wellcomecollection.org/_next/data/dl7PfaUnoIXaQk0ol_5M8/works.json?query=things&source=search_form%2Fworks
# These routes will mimic the `/catalogue/webapp/pages/*` directory
# see: https://github.com/vercel/next.js/issues/16090

// This listener is separate to the below because it has 2 wildcards in
// the path pattern and so the splitting logic doesn't work for it
module "any_search_data_listener" {
  source = "../../../infrastructure/modules/alb_listener_rule"

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  priority      = "206"
  path_patterns = ["/_next/data/*/search/*.json", "/_next/data/*/works/*.json",]
}

locals {
  # Listener rules are limited to 5 different condition values so we
  # must create several to cover all of the path patterns we need

  works_data_paths = [
    "/_next/data/*/download.json",
    "/_next/data/*/embed.json",
    "/_next/data/*/image.json",
    "/_next/data/*/images.json",
    "/_next/data/*/item.json",
    "/_next/data/*/items.json",
    "/_next/data/*/progress.json",
    "/_next/data/*/work.json",
    "/_next/data/*/works.json",
  ]
  max_conditions_per_rule = 5

  works_data_path_chunks = chunklist(local.works_data_paths, local.max_conditions_per_rule)
  works_data_path_sets = zipmap(
    range(length(local.works_data_path_chunks)),
    local.works_data_path_chunks
  )

  max_priority = 49996
  min_priority = local.max_priority - length(local.works_data_path_chunks) + 1
}

module "works_data_listener" {
  source   = "../../../infrastructure/modules/alb_listener_rule"
  for_each = local.works_data_path_sets

  alb_listener_https_arn = var.environment["listener_https_arn"]
  alb_listener_http_arn  = var.environment["listener_http_arn"]
  target_group_arn       = local.target_group_arn

  path_patterns = each.value
  priority      = local.min_priority + each.key
}
