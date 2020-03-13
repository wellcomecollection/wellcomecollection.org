module "prod" {
  source = "./stack"

  namespace = "prod"

  vpc_id   = local.vpc_id
  subnets  = local.public_subnets
  cert_arn = "arn:aws:acm:eu-west-1:130871440101:certificate/6876e191-3f7a-47b7-9c67-40f45bb51b72"
}

module "stage" {
  source = "./stack"

  namespace = "stage"

  vpc_id   = local.vpc_id
  subnets  = local.public_subnets
  cert_arn = "arn:aws:acm:eu-west-1:130871440101:certificate/6876e191-3f7a-47b7-9c67-40f45bb51b72"
}

//
//module "content-prod" {
//  source = "./modules/content"
//
//  cluster_arn  = module.prod.cluster_arn
//  namespace_id = module.prod.namespace_id
//
//  container_image = "wellcome/content_webapp:test"
//  nginx_image_uri = data.aws_ssm_parameter.nginx_image_uri.value
//
//  env_suffix = "prod"
//
//  listener_http_arn  = module.prod.listener_http_arn
//  listener_https_arn = module.prod.listener_https_arn
//
//  security_group_ids = [
//    module.prod.interservice_security_group_id,
//    module.prod.service_egress_security_group_id,
//  ]
//
//  service_secret_env_vars = {
//    dotdigital_username = "content/dotdigital/username"
//    dotdigital_password = "content/dotdigital/password"
//  }
//
//  content_subdomain = "content.www.wellcomecollection.org"
//}
//
//module "catalogue-prod" {
//  source = "./modules/catalogue"
//
//  cluster_arn  = module.prod.cluster_arn
//  namespace_id = module.prod.namespace_id
//
//  container_image = "wellcome/catalogue_webapp:test"
//  nginx_image_uri = data.aws_ssm_parameter.nginx_image_uri.value
//
//  env_suffix = "prod"
//
//  listener_http_arn  = module.prod.listener_http_arn
//  listener_https_arn = module.prod.listener_https_arn
//
//  security_group_ids = [
//    module.prod.interservice_security_group_id,
//    module.prod.service_egress_security_group_id,
//  ]
//
//  catalogue_subdomain = "works.www.wellcomecollection.org"
//}
