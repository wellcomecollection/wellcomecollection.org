locals {
  default_tags = {
    TerraformConfigurationURL = "https://github.com/wellcomecollection/wellcomecollection.org/tree/main/content/terraform"
    Department                = "Digital Platform"
    Division                  = "Culture and Society"
    Use                       = "Content Webapp"
  }

  default_prod_tags = merge(
    local.default_tags,
    {
      Environment = "Production"
    }
  )


  default_stage_tags = merge(
    local.default_tags,
    {
      Environment = "Staging"
    }
  )

  e2e_app_image   = "${data.terraform_remote_state.experience_shared.outputs.buildkite_ecr_uri}:content-env.e2e"
  stage_app_image = "${data.terraform_remote_state.experience_shared.outputs.content_webapp_ecr_uri}:env.stage"
  prod_app_image  = "${data.terraform_remote_state.experience_shared.outputs.content_webapp_ecr_uri}:env.prod"

  cloudfront_header_secrets = data.terraform_remote_state.cache.outputs.cloudfront_header_shared_secrets
}