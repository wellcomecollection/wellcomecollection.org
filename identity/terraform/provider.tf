locals {
  default_tags = {
    TerraformConfigurationURL = "https://github.com/wellcomecollection/wellcomecollection.org/tree/main/identity"
    Department                = "Digital Platform"
    Division                  = "Culture and Society"
    Use                       = "Identity APIs"
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
}

provider "aws" {
  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }

  region = "eu-west-1"

  default_tags {
    tags = local.default_prod_tags
  }
}

provider "aws" {
  alias = "stage"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }

  region = "eu-west-1"

  default_tags {
    tags = local.default_stage_tags
  }
}
