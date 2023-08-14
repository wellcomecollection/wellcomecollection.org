locals {
  default_tags = {
    TerraformConfigurationURL = "https://github.com/wellcomecollection/wellcomecollection.org/tree/main/catalogue/terraform"
    Department                = "Digital Platform"
    Division                  = "Culture and Society"
    Use                       = "Catalogue Webapp"
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

  e2e_app_image   = "${data.terraform_remote_state.experience_shared.outputs.buildkite_ecr_uri}:catalogue-env.e2e"
  stage_app_image = "${data.terraform_remote_state.experience_shared.outputs.catalogue_webapp_ecr_uri}:env.stage"
  prod_app_image  = "${data.terraform_remote_state.experience_shared.outputs.catalogue_webapp_ecr_uri}:env.prod"
}
