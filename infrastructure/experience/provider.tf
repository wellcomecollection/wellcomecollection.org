locals {
  default_tags = {
    TerraformConfigurationURL = "https://github.com/wellcomecollection/wellcomecollection.org/tree/main/infrastructure/experience"
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
  region = var.aws_region

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }

  default_tags {
    tags = local.default_prod_tags
  }
}

provider "aws" {
  region = var.aws_region
  alias  = "stage"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }

  default_tags {
    tags = local.default_stage_tags
  }
}

provider "aws" {
  region = "eu-west-1"
  alias  = "dns"

  assume_role {
    role_arn = "arn:aws:iam::267269328833:role/wellcomecollection-assume_role_hosted_zone_update"
  }
}
