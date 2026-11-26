# Beta tests (RFC 094 in wellcomecollection/docs). Terraform owns the
# functions, their stores and where they are attached. CI owns the code: see
# .buildkite/scripts/deploy_beta_test_functions.sh, which deploys it to stage
# and then prod through the deployment pipeline.
locals {
  beta_test_environments = {
    # Host-only on stage, so stage never overwrites a visitor's prod cookies
    stage = { cookie_domain = "" }
    prod  = { cookie_domain = ".wellcomecollection.org" }
  }
}

resource "aws_cloudfront_key_value_store" "beta_tests" {
  for_each = local.beta_test_environments

  name    = "beta-tests-${each.key}"
  comment = "Running beta tests on ${each.key}, written by the toggles test commands"
}

resource "aws_cloudfront_function" "beta_tests_request" {
  for_each = local.beta_test_environments

  name    = "beta-tests-request-${each.key}"
  runtime = "cloudfront-js-2.0"
  comment = "Assigns visitors to beta tests before the cache"
  publish = true
  code = replace(
    replace(file("${path.module}/cloudfront_functions/beta-tests-request.js"), "__VERSION__", "terraform"),
    "__COOKIE_DOMAIN__", each.value.cookie_domain
  )
  key_value_store_associations = [aws_cloudfront_key_value_store.beta_tests[each.key].arn]

  lifecycle {
    ignore_changes = [code]
  }
}

resource "aws_cloudfront_function" "beta_tests_response" {
  for_each = local.beta_test_environments

  name    = "beta-tests-response-${each.key}"
  runtime = "cloudfront-js-2.0"
  comment = "Stores visitors' beta test cookies"
  publish = true
  code = replace(
    replace(file("${path.module}/cloudfront_functions/beta-tests-response.js"), "__VERSION__", "terraform"),
    "__COOKIE_DOMAIN__", each.value.cookie_domain
  )

  lifecycle {
    ignore_changes = [code]
  }
}

# A test that changes no page, so the stage check after each deploy can see
# assignment working. The test commands write this key once they exist, and
# must keep the canary on stage.
resource "aws_cloudfrontkeyvaluestore_key" "stage_canary" {
  key_value_store_arn = aws_cloudfront_key_value_store.beta_tests["stage"].arn
  key                 = "tests"
  value = jsonencode([{
    id        = "betaTestsCanary"
    version   = 1
    enrolment = 100
    split     = 50
    paths     = []
  }])

  lifecycle {
    ignore_changes = [value]
  }
}

# The functions catch their own errors, so these count only what they can't:
# running out of compute or memory, and returning an invalid event
resource "aws_cloudwatch_metric_alarm" "prod_beta_test_function_errors" {
  for_each = {
    request  = aws_cloudfront_function.beta_tests_request["prod"].name
    response = aws_cloudfront_function.beta_tests_response["prod"].name
  }

  alarm_name          = "wc-org-prod-beta-tests-${each.key}-function-errors"
  alarm_description   = "[component=${local.alarm_component} severity=high] The beta test ${each.key} function is failing on wellcomecollection.org"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  threshold           = 0
  treat_missing_data  = "notBreaching"

  metric_query {
    id          = "errors"
    expression  = "execution + validation"
    label       = "Function errors"
    return_data = true
  }

  metric_query {
    id = "execution"
    metric {
      metric_name = "FunctionExecutionErrors"
      namespace   = "AWS/CloudFront"
      period      = 300
      stat        = "Sum"
      dimensions = {
        FunctionName = each.value
        Region       = "Global"
      }
    }
  }

  metric_query {
    id = "validation"
    metric {
      metric_name = "FunctionValidationErrors"
      namespace   = "AWS/CloudFront"
      period      = 300
      stat        = "Sum"
      dimensions = {
        FunctionName = each.value
        Region       = "Global"
      }
    }
  }

  alarm_actions = [local.monitoring_infra["chatbot_topic_arns"]["us-east-1"]]
  ok_actions    = [local.monitoring_infra["chatbot_topic_arns"]["us-east-1"]]

  tags = merge(local.alarm_tags, { severity = "high" })
}
