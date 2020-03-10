data "aws_ssm_parameter" "nginx_image_uri" {
  name = "/platform/images/latest/nginx_experience"
  provider = aws.platform
}

module "prod" {
  source = "./stack"

  namespace = "prod"

  vpc_id  = local.vpc_id
  subnets = local.public_subnets
}

module "content-prod" {
  source = "./modules/content"

  cluster_arn  = module.prod.cluster_arn
  namespace_id = module.prod.namespace_id

  container_image = "wellcome/content_webapp:b991392217c35a675779e2e4838ed3d700bc76d1"
  nginx_image_uri = data.aws_ssm_parameter.nginx_image_uri.value

  env_suffix = "prod"

  listener_http_arn  = module.prod.listener_http_arn
  listener_https_arn = module.prod.listener_https_arn

  security_group_ids = [
    module.prod.interservice_security_group_id,
    module.prod.service_egress_security_group_id,
  ]

  service_secret_env_vars = {
    dotdigital_username = "content/dotdigital/username"
    dotdigital_password = "content/dotdigital/password"
  }

  content_subdomain = "content.www.wellcomecollection.org"
}
