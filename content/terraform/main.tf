module "content-prod" {
  source = "./stack"

  container_image = "wellcome/content_webapp:${var.container_tag}"
  nginx_image     = local.nginx_image
  env_suffix      = "prod"

  cluster_arn  = local.prod_cluster_arn
  namespace_id = local.prod_namespace_id

  alb_listener_http_arn  = local.prod_alb_listener_http_arn
  alb_listener_https_arn = local.prod_alb_listener_https_arn

  interservice_security_group_id   = local.prod_interservice_security_group_id
  service_egress_security_group_id = local.prod_service_egress_security_group_id

  subdomain = "content.www"
}

// Uncomment to create a staging environment
// You can replace var.container_tag & local.nginx_image
// to test differing images.
//
// The service should be available at:
// "content.www-stage.wellcomecollection.org/works"
//
//module "content-stage" {
//  source = "./stack"
//
//  container_image = "wellcome/content_webapp:${var.container_tag}"
//  nginx_image     = local.nginx_image
//  env_suffix      = "stage"
//
//  cluster_arn  = local.stage_cluster_arn
//  namespace_id = local.stage_namespace_id
//
//  alb_listener_http_arn  = local.stage_alb_listener_http_arn
//  alb_listener_https_arn = local.stage_alb_listener_https_arn
//
//  interservice_security_group_id   = local.stage_interservice_security_group_id
//  service_egress_security_group_id = local.stage_service_egress_security_group_id
//
//  subdomain = "content.www-stage"
//}
