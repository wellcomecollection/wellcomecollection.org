provider "aws" {
  region = var.aws_region

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}
