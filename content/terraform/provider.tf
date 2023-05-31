provider "aws" {
  region = "eu-west-1"

  default_tags {
    tags = local.default_prod_tags
  }

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "aws" {
  alias  = "stage"
  region = "eu-west-1"

  default_tags {
    tags = local.default_stage_tags
  }

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "template" {}

provider "aws" {
  alias  = "platform"
  region = "eu-west-1"

  assume_role {
    role_arn = "arn:aws:iam::760097843905:role/platform-developer"
  }
}
