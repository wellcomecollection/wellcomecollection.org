resource "aws_s3_bucket" "cloudfront_logs" {
  bucket = "wellcomecollection-experience-cloudfront-logs"

  lifecycle_rule {
    id      = "cf-logs"
    prefix  = ""
    enabled = true

    expiration {
      days = 30
    }
  }

  grant {
    # Grant CloudFront logs access to your Amazon S3 Bucket
    # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html#AccessLogsBucketAndFileOwnership
    id          = "c4c1ede66af53448b93c283ce9448c4ba468c9432aa01d700d3878632f77d2d0"
    permissions = ["FULL_CONTROL"]
    type        = "CanonicalUser"
  }
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  # Whenever a new log file is written to the CloudFront logs bucket,
  # we want to inspect it for 5xx errors.
  lambda_function {
    lambda_function_arn = module.slack_alerts_for_5xx.arn
    events              = ["s3:ObjectCreated:*"]
  }
}
