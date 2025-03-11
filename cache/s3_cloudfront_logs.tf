resource "aws_s3_bucket" "cloudfront_logs" {
  bucket = "wellcomecollection-experience-cloudfront-logs"
}

resource "aws_s3_bucket_lifecycle_configuration" "expire_logs_after_30_days" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    id     = "cf-logs"
    status = "Enabled"

    expiration {
      days = 30
    }
  }
}

data "aws_canonical_user_id" "current" {}

resource "aws_s3_bucket_acl" "allow_cloudfront_access" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  access_control_policy {
    owner {
      id = data.aws_canonical_user_id.current.id
    }

    grant {
      # Grant CloudFront logs access to the Amazon S3 Bucket
      # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html#AccessLogsBucketAndFileOwnership
      grantee {
        id   = "c4c1ede66af53448b93c283ce9448c4ba468c9432aa01d700d3878632f77d2d0"
        type = "CanonicalUser"
      }
      permission = "FULL_CONTROL"
    }
  }
}
