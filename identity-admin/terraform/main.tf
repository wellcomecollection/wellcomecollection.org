// The service should be available at: "works.www-stage.wellcomecollection.org/works"

module "identity-admin-stage" {
  source = "./stack"

  container_image = local.stage_app_image
  env_suffix      = "stage"

  cluster_arn  = local.stage_cluster_arn
  namespace_id = local.stage_namespace_id

  alb_listener_http_arn  = local.stage_alb_listener_http_arn
  alb_listener_https_arn = local.stage_alb_listener_https_arn

  interservice_security_group_id   = local.stage_interservice_security_group_id
  service_egress_security_group_id = local.stage_service_egress_security_group_id

  subdomain = "account-admin"

  private_subnets = local.private_subnets
  vpc_id          = local.vpc_id
}

module "identity-admin-stage" {
  source = "./stack"

  container_image = local.stage_app_image
  env_suffix      = "stage"

  cluster_arn  = local.stage_cluster_arn
  namespace_id = local.stage_namespace_id

  alb_listener_http_arn  = local.stage_alb_listener_http_arn
  alb_listener_https_arn = local.stage_alb_listener_https_arn

  interservice_security_group_id   = local.stage_interservice_security_group_id
  service_egress_security_group_id = local.stage_service_egress_security_group_id

  subdomain = "account-admin-stage"

  private_subnets = local.private_subnets
  vpc_id          = local.vpc_id
}
