// The service should be available at: "content.www.wellcomecollection.org"

module "content-prod" {
  source = "./stack"

  environment = data.terraform_remote_state.experience_shared.outputs.prod

  container_image = local.prod_app_image
  nginx_image     = local.nginx_image
  env_suffix      = "prod"

  alb_listener_http_arn  = local.prod_alb_listener_http_arn
  alb_listener_https_arn = local.prod_alb_listener_https_arn

  interservice_security_group_id   = local.prod_interservice_security_group_id
  service_egress_security_group_id = local.prod_service_egress_security_group_id

  subdomain = "content.www"
}

// The service should be available at: "content.www-stage.wellcomecollection.org"

module "content-stage" {
  source = "./stack"

  environment = data.terraform_remote_state.experience_shared.outputs.stage

  container_image = local.stage_app_image
  nginx_image     = local.nginx_image
  env_suffix      = "stage"

  alb_listener_http_arn  = local.stage_alb_listener_http_arn
  alb_listener_https_arn = local.stage_alb_listener_https_arn

  interservice_security_group_id   = local.stage_interservice_security_group_id
  service_egress_security_group_id = local.stage_service_egress_security_group_id

  subdomain = "content.www-stage"

  providers = {
    aws = aws.stage
  }
}
