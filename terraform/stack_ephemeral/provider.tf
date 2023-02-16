locals {
  default_tags = {
    TerraformConfigurationURL = "https://github.com/wellcomecollection/wellcomecollection.org/tree/main/terraform"
    Department                = "Digital Platform"
    Division                  = "Culture and Society"
    Use                       = "Experience infrastructure"
    Environment               = "Production"
  }
}

provider "aws" {
  region = "eu-west-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }

  default_tags {
    tags = local.default_tags
  }
}
