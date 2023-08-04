output "cache_policies" {
  value = {
    for policy in [
      aws_cloudfront_cache_policy.static_content,
      aws_cloudfront_cache_policy.weco_apps,
      aws_cloudfront_cache_policy.weco_apps_all_params,
      aws_cloudfront_cache_policy.short_lived_toggles_only,
      data.aws_cloudfront_cache_policy.managed_caching_disabled
    ]
    : policy.name => policy.id
  }
}

output "request_policies" {
  value = {
    for policy in [
      aws_cloudfront_origin_request_policy.host_query_and_toggles,
      data.aws_cloudfront_origin_request_policy.managed_all_viewer
    ]
    : policy.name => policy.id
  }
}

output "response_policies" {
  value = {
    for policy in [
      aws_cloudfront_response_headers_policy.weco_security
    ]
    : policy.name => policy.id
  }
}
