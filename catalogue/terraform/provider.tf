provider "aws" {
  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }

  region  = var.aws_region
  version = "~> 2.47.0"
}

// Old

provider "aws" {
  version = "~> 2.7"
  region  = "us-east-1"
  alias   = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::130871440101:role/experience-developer"
  }
}

provider "random" {
  version = "~> 2.1"
}

provider "template" {
  version = "~> 2.1"
}
