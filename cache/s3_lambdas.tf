resource "aws_s3_bucket" "lambdas" {
  bucket = "weco-lambdas"
}

resource "aws_s3_bucket_policy" "lambdas" {
  bucket = aws_s3_bucket.lambdas.id
  policy = templatefile(
    "${path.module}/bucket_policy.json",
    {
      bucket_name = aws_s3_bucket.lambdas.id
    }
  )
}

resource "aws_s3_bucket_acl" "lambdas" {
  bucket = aws_s3_bucket.lambdas.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "lambdas" {
  bucket = aws_s3_bucket.lambdas.id

  versioning_configuration {
    status = "Enabled"
  }
}
