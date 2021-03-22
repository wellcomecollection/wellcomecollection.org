provider "aws" {
  region  = var.aws_region
  version = "~> 2.47.0"

  assume_role {
    role_arn = "arn:aws:iam::770700576653:role/identity-developer"
  }
}

provider "template" {
  version = "~> 2.1"
}

provider "aws" {
  alias = "platform"

  region  = var.aws_region
  version = "~> 2.47.0"

  assume_role {
    role_arn = "arn:aws:iam::760097843905:role/platform-developer"
  }
}
