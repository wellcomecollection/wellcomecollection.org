data "terraform_remote_state" "identity-experience_shared" {
  backend = "s3"

  config = {
   role_arn = "arn:aws:iam::770700576653:role/identity-developer"
    bucket  = "wellcomecollection-identity-experience-infra"
    key     = "terraform/identity-experience.tfstate"
    region  = "eu-west-1"
  }
}

data "terraform_remote_state" "infra_shared" {
  backend = "s3"

  config = {
    bucket   = "wellcomecollection-platform-infra"
    key      = "terraform/platform-infrastructure/accounts/identity.tfstate"
    role_arn = "arn:aws:iam::760097843905:role/platform-developer"
    region   = "eu-west-1"
  }
}
