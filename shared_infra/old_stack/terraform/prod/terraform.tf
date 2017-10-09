terraform {
  required_version = ">= 0.10"

  backend "s3" {
    key            = "terraform.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}
