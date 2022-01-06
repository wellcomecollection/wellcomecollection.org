output "bucket_endpoint" {
  value = aws_s3_bucket.website_bucket.website_endpoint
}

output "website_uri" {
  value = var.website_uri
}
