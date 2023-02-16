module "next13" {
  source = "../../infrastructure/experience/stack"

  namespace = "next13"

  vpc_id   = local.vpc_id
  subnets  = local.public_subnets
  cert_arn = local.wellcomecollection_cert_arn
}

module "catalogue" {
  source = "../../catalogue/terraform/stack"

  container_image = "${local.app_image}:next13"
  nginx_image     = local.nginx_image
  env_suffix      = "next13"

  cluster_arn  = module.next13.cluster_arn
  namespace_id = module.next13.namespace_id

  alb_listener_http_arn  = module.next13.listener_http_arn
  alb_listener_https_arn = module.next13.listener_http_arn

  interservice_security_group_id   = module.next13.interservice_security_group_id
  service_egress_security_group_id = module.next13.service_egress_security_group_id

  subdomain = "works.next13.www-stage"
}
