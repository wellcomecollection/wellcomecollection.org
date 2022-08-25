resource "aws_s3_bucket" "lambdas" {
  bucket = "weco-lambdas"
  acl    = "private"
  policy = templatefile(
    "${path.module}/bucket_policy.json",
    {
      bucket_name = "weco-lambdas"
    }
  )

  versioning {
    enabled = true
  }
}
