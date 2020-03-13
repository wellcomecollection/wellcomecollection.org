terraform {
  required_version = ">= 0.9"

  backend "s3" {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"

    bucket         = "wellcomecollection-experience-infra"
    key            = "terraform/experience/catalogue.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
  }
}
