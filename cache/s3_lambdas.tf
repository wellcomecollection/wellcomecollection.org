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

# The edge Lambdas keep their own copy of the code, so old zips are only needed for a rollback
# from S3; keep 90 days of them.
resource "aws_s3_bucket_lifecycle_configuration" "lambdas" {
  bucket = aws_s3_bucket.lambdas.id

  rule {
    id     = "expire_old_versions"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}
