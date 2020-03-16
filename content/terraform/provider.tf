provider "aws" {
  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }

  region  = var.aws_region
  version = "~> 2.47.0"
}
