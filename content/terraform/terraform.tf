terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }


  backend "s3" {
    key            = "build-state/content.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"

    assume_role = {
      role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
    }
  }
}
