resource "aws_s3_bucket" "terraform_build_state_bucket" {
  bucket = "wellcomecollection-infra"
  acl    = "private"
}

resource "aws_dynamodb_table" "terraform_lockstate" {
  name           = "terraform-locktable"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    App = "terraform-config"
  }
}
