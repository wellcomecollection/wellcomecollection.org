variable "aws_access_key" {}
variable "aws_secret_key" {}
variable "aws_region" {}
variable "build_state_bucket" {}

provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region     = "${var.aws_region}"
}

// TODO: Create the build state bucket here too
resource "aws_dynamodb_table" "terraform-lockstate" {
  name           = "terraform-locktable"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags {
    App = "terraform-config"
  }
}
