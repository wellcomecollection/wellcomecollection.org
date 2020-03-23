output "wc_org_cf_distro_id" {
  value = aws_cloudfront_distribution.wellcomecollection_org.id
}

output "stage_wc_org_cf_distro_id" {
  value = aws_cloudfront_distribution.stage_wc_org.id
}
