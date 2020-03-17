data "terraform_remote_state" "experience_shared" {
  backend = "s3"

  config = {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"

    bucket         = "wellcomecollection-experience-infra"
    key            = "terraform/experience.tfstate"
    region         = "eu-west-1"
  }
}

data "aws_ssm_parameter" "nginx_image_uri" {
  name = "/platform/images/latest/nginx_experience"
  provider = aws.platform
}
