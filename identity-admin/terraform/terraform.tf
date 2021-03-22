terraform {
  required_version = ">= 0.9"

  backend "s3" {
    role_arn = "arn:aws:iam::770700576653:role/identity-developer"

    bucket         = "wellcomecollection-identity-experience-infra"
    key            = "build-state/identity-admin.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
  }
}
