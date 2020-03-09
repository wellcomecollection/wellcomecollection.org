provider "aws" {
  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }

  region  = var.aws_region
  version = "~> 2.47.0"
}

provider "aws" {
  alias = "platform"

  region  = var.aws_region
  version = "~> 2.47.0"

  assume_role {
    role_arn = "arn:aws:iam::760097843905:role/platform-developer"
  }
}
