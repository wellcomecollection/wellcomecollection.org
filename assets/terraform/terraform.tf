terraform {
  backend "s3" {
    key            = "build-state/client.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
    role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  region = "eu-west-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us_east_1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-read_only"
  }
}

data "aws_acm_certificate" "dotorg" {
  provider = aws.us_east_1
  domain = "wellcomecollection.org"
  statuses = ["ISSUED"]
}

module "static" {
  source              = "../../infrastructure/modules/s3_website"
  website_uri         = "i.wellcomecollection.org"
  acm_certificate_arn = data.aws_acm_certificate.dotorg.arn
  min_ttl             = 86400
  default_ttl         = 86400
  max_ttl             = 86400
}

