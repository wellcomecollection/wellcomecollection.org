provider "aws" {
  region  = var.aws_region

  assume_role {
    role_arn = "arn:aws:iam::770700576653:role/identity-developer"
  }
}

provider "template" {}

provider "aws" {
  alias  = "platform"
  region = var.aws_region

  assume_role {
    role_arn = "arn:aws:iam::760097843905:role/platform-developer"
  }
}
