resource "aws_s3_bucket" "lambdas" {
  bucket = "weco-lambdas"
  acl    = "private"
  policy = data.template_file.lambdas_bucket_policy.rendered

  versioning {
    enabled = true
  }
}

data "template_file" "lambdas_bucket_policy" {
  template = file("${path.module}/bucket_policy.json")

  vars = {
    bucket_name = "weco-lambdas"
  }
}
