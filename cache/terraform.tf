# Setup terraform for this service
terraform {
  backend "s3" {
    key            = "build-state/cache.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
    assume_role = {
      role_arn = "arn:aws:iam::130871440101:role/experience-developer"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-admin"
  }

  default_tags {
    tags = {
      TerraformConfigurationURL = "https://github.com/wellcomecollection/wellcomecollection.org/tree/main/cache"
      Department                = "Digital Platform"
      Division                  = "Culture and Society"
      Use                       = "Front-end CloudFront distributions"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
  alias  = "dns"

  assume_role {
    role_arn = "arn:aws:iam::267269328833:role/wellcomecollection-assume_role_hosted_zone_update"
  }

  default_tags {
    tags = {
      TerraformConfigurationURL = "https://github.com/wellcomecollection/wellcomecollection.org/tree/main/cache"
      Department                = "Digital Platform"
      Division                  = "Culture and Society"
      Use                       = "Front-end CloudFront distributions"
    }
  }
}


data "terraform_remote_state" "experience" {
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

data "terraform_remote_state" "assets" {
  backend = "s3"

  config = {
    bucket = "wellcomecollection-infra"
    key    = "build-state/client.tfstate"
    region = "eu-west-1"
    assume_role = {
      role_arn = "arn:aws:iam::130871440101:role/experience-read_only"
    }
  }
}

data "terraform_remote_state" "platform_account" {
  backend = "s3"

  config = {
    bucket = "wellcomecollection-platform-infra"
    key    = "terraform/aws-account-infrastructure/platform.tfstate"
    region = "eu-west-1"
    assume_role = {
      role_arn = "arn:aws:iam::760097843905:role/platform-read_only"
    }
  }
}

output "s3_edge_lambda_origin_version_id" {
  value = data.aws_s3_object.edge_lambda_origin.version_id
}

output "latest_edge_lambda_origin_request_version" {
  value = aws_lambda_function.edge_lambda_request.version
}

output "latest_edge_lambda_origin_response_version" {
  value = aws_lambda_function.edge_lambda_response.version
}

