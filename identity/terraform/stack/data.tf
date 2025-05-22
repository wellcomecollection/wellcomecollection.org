data "terraform_remote_state" "infra_shared" {
  backend = "s3"

  config = {
    assume_role = {
      role_arn = "arn:aws:iam::760097843905:role/platform-read_only"
    }
    bucket   = "wellcomecollection-platform-infra"
    key      = "terraform/aws-account-infrastructure/experience.tfstate"
    region   = "eu-west-1"
  }
}
