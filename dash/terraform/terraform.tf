terraform {
  required_version = ">= 0.11"

  backend "s3" {
    key            = "build-state/dash.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
    role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 2.2"
  region  = "eu-west-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  version = "~> 2.2"
  region  = "us-east-1"
  alias   = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "template" {
  version = "~> 2.0"
}

data "aws_acm_certificate" "wellcomecollection_ssl_cert" {
  provider = aws.us-east-1
  domain   = "wellcomecollection.org"
}

module "dash" {
  source              = "../../infrastructure/terraform/modules/s3_website"
  website_uri         = "dash.wellcomecollection.org"
  acm_certificate_arn = data.aws_acm_certificate.wellcomecollection_ssl_cert.arn
}

