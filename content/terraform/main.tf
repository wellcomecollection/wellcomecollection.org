module "content-prod" {
  source = "./stack"

  container_image = "wellcome/content_webapp:${var.container_tag}"
  nginx_image     = data.aws_ssm_parameter.nginx_image_uri.value
  env_suffix      = "prod"

  cluster_arn  = local.prod_cluster_arn
  namespace_id = local.prod_namespace_id

  alb_listener_http_arn  = local.prod_alb_listener_http_arn
  alb_listener_https_arn = local.prod_alb_listener_https_arn

  interservice_security_group_id   = local.prod_interservice_security_group_id
  service_egress_security_group_id = local.prod_service_egress_security_group_id

  subdomain = "content.www"
}
