// The service should be available at: "content.www.wellcomecollection.org"

module "content-prod" {
  source = "./stack"

  environment = data.terraform_remote_state.experience_shared.outputs.prod

  container_image = local.prod_app_image
  nginx_image     = local.nginx_image
  env_suffix      = "prod"

  subdomain = "content.www"
}

// The service should be available at: "content.www-stage.wellcomecollection.org"

module "content-stage" {
  source = "./stack"

  environment = data.terraform_remote_state.experience_shared.outputs.stage

  container_image = local.stage_app_image
  nginx_image     = local.nginx_image
  env_suffix      = "stage"

  subdomain = "content.www-stage"

  providers = {
    aws = aws.stage
  }
}
