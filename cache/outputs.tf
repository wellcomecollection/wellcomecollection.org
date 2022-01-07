output "wc_org_cf_distro_id" {
  value = aws_cloudfront_distribution.wellcomecollection_org.id
}

output "stage_wc_org_cf_distro_id" {
  value = module.stage_wc_org_cloudfront_distribution.distribution_id
}
