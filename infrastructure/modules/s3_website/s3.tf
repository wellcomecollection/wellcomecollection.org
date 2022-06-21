resource "aws_s3_bucket" "website_bucket" {
  bucket = var.website_uri
  acl    = "public-read"

  policy = templatefile(
    "${path.module}/s3-website-policy.json",
    {
      website_uri = var.website_uri
    }
  )

  website {
    index_document = "index.html"
  }

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}
