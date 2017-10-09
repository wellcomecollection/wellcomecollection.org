terraform {
  required_version = ">= 0.9"

  backend "s3" {
    key        = "terraform-dev.tfstate"
    lock_table = "terraform-locktable"
    region     = "eu-west-1"
    bucket     = "wellcomecollection-infra"
  }
}
