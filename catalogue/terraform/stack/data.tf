data "terraform_remote_state" "infra_shared" {
  backend = "s3"

  config = {
    bucket   = "wellcomecollection-platform-infra"
    key      = "terraform/platform-infrastructure/accounts/experience.tfstate"
    role_arn = "arn:aws:iam::760097843905:role/platform-developer"
    region   = "eu-west-1"
  }
}
