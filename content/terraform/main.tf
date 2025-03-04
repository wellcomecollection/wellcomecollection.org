// The service should be available at: "content.www.wellcomecollection.org"

module "content-prod" {
  source = "./stack"

  environment = data.terraform_remote_state.experience_shared.outputs.prod
  cloudfront_header_secrets = local.cloudfront_header_secrets

  desired_task_count = 6

  container_image = local.prod_app_image
  env_suffix      = "prod"

  subdomain = "content.www"
}

// The service should be available at: "content.www-stage.wellcomecollection.org"

module "content-stage" {
  source = "./stack"

  environment = data.terraform_remote_state.experience_shared.outputs.stage
  cloudfront_header_secrets = local.cloudfront_header_secrets

  container_image = local.stage_app_image
  env_suffix      = "stage"

  subdomain = "content.www-stage"

  use_fargate_spot              = true
  turn_off_outside_office_hours = true

  providers = {
    aws = aws.stage
  }
}

// The service should be available at: "content.www-e2e.wellcomecollection.org"

module "content-e2e" {
  source = "./stack"

  environment = data.terraform_remote_state.experience_shared.outputs.e2e
  cloudfront_header_secrets = local.cloudfront_header_secrets

  container_image = local.e2e_app_image
  env_suffix      = "e2e"

  subdomain = "content.www-e2e"

  use_fargate_spot = true

  providers = {
    aws = aws.stage
  }
}
