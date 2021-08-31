locals {
  default_tags = {
    TerraformConfigurationURL = "https://github.com/wellcomecollection/wellcomecollection.org/tree/main/infrastructure/experience"
    Department                = "Digital Platform"
    Division                  = "Culture and Society"
    Use                       = "Identity APIs"
    Environment               = "Production"
  }
}

provider "aws" {
  region = var.aws_region

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }

  default_tags {
    tags = local.default_tags
  }
}

provider "aws" {
  region = "eu-west-1"
  alias  = "dns"

  assume_role {
    role_arn = "arn:aws:iam::267269328833:role/wellcomecollection-assume_role_hosted_zone_update"
  }
}
