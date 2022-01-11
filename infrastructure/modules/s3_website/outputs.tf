output "bucket_domain_name" {
  value = aws_s3_bucket.website_bucket.bucket_regional_domain_name
}

output "website_uri" {
  value = var.website_uri
}
