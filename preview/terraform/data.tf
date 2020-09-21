data "terraform_remote_state" "experience" {
  backend = "s3"

  config = {
    role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
    bucket         = "wellcomecollection-experience-infra"
    key            = "terraform/experience.tfstate"
    region         = "eu-west-1"
  }
}

data "terraform_remote_state" "cache" {
  backend = "s3"

  config = {
    key            = "build-state/cache.tfstate"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
    role_arn       = "arn:aws:iam::130871440101:role/experience-developer"
  }
}
