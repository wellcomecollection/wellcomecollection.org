data "terraform_remote_state" "infra_shared" {
  backend = "s3"

  config = {
    bucket   = "wellcomecollection-platform-infra"
    key      = "terraform/aws-account-infrastructure/experience.tfstate"
    role_arn = "arn:aws:iam::760097843905:role/platform-read_only"
    region   = "eu-west-1"
  }
}
