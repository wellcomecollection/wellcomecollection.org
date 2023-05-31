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

  stage_app_image = "${data.terraform_remote_state.experience_shared.outputs.catalogue_webapp_ecr_uri}:env.stage"
  prod_app_image  = "${data.terraform_remote_state.experience_shared.outputs.catalogue_webapp_ecr_uri}:env.prod"

  nginx_image = "760097843905.dkr.ecr.eu-west-1.amazonaws.com/uk.ac.wellcome/nginx_experience:78090f62ee23a39a1b4e929f25417bfa128c2aa8"
}
