data "terraform_remote_state" "experience_shared" {
  backend = "s3"

  config = {
    assume_role = {
      role_arn = "arn:aws:iam::130871440101:role/experience-read_only"
    }

    bucket = "wellcomecollection-experience-infra"
    key    = "terraform/experience.tfstate"
    region = "eu-west-1"
  }
}

data "terraform_remote_state" "cache" {
  backend = "s3"

  config = {
    assume_role = {
      role_arn = "arn:aws:iam::130871440101:role/experience-read_only"
    }

    bucket = "wellcomecollection-infra"
    key    = "build-state/cache.tfstate"
    region = "eu-west-1"
  }
}
