data "aws_caller_identity" "current" {}

terraform {
  backend "s3" {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"

    bucket         = "wellcomecollection-experience-infra"
    key            = "terraform/wellcomecollection.org/stack_ephemeral.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
  }
}
