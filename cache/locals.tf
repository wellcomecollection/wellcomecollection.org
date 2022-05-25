locals {
  edge_lambda_request_version  = 83
  edge_lambda_response_version = 84

  wellcome_cdn_cert_arn = "arn:aws:acm:us-east-1:130871440101:certificate/bb840c52-56bb-4bf8-86f8-59e7deaf9c98"

  lambda_alarm_topic_arn = data.terraform_remote_state.monitoring.outputs.experience_lambda_error_alerts_topic_arn
}
