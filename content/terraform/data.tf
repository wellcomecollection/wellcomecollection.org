data "terraform_remote_state" "experience_shared" {
  backend = "s3"

  config = {
    role_arn = "arn:aws:iam::130871440101:role/experience-read_only"

    bucket = "wellcomecollection-experience-infra"
    key    = "terraform/experience.tfstate"
    region = "eu-west-1"
  }
}
