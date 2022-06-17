terraform {
  backend "s3" {
    key            = "build-state/static.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
    role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  region = "eu-west-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-admin"
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

locals {
  wellcome_cdn_cert_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"
}

module "static" {
  source              = "../../infrastructure/modules/s3_website"
  website_uri         = "static.wellcomecollection.org"
  acm_certificate_arn = local.wellcome_cdn_cert_arn
}
