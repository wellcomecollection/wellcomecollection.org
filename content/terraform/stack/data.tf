data "terraform_remote_state" "infra_shared" {
  backend = "s3"

  config = {
    bucket   = "wellcomecollection-platform-infra"
    key      = "terraform/aws-account-infrastructure/experience.tfstate"
    region   = "eu-west-1"

    assume_role = {
      role_arn = "arn:aws:iam::760097843905:role/platform-read_only"
    }
  }
}

data "aws_secretsmanager_secret_version" "civicuk" {
  secret_id = "civicuk/api_key_multi"
  version_stage = "AWSCURRENT"
}
