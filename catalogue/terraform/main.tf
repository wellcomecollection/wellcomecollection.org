// The service should be available at: "works.www.wellcomecollection.org/works"

module "catalogue-prod" {
  source = "./stack"

  container_image = local.prod_app_image
  nginx_image     = local.nginx_image
  env_suffix      = "prod"

  environment = data.terraform_remote_state.experience_shared.outputs.prod

  subdomain = "works.www"
}

// The service should be available at: "works.www-stage.wellcomecollection.org/works"

module "catalogue-stage" {
  source = "./stack"

  container_image = local.stage_app_image
  nginx_image     = local.nginx_image
  env_suffix      = "stage"

  environment = data.terraform_remote_state.experience_shared.outputs.stage

  subdomain = "works.www-stage"

  providers = {
    aws = aws.stage
  }
}
