# Setup terraform for this service
terraform {
  required_version = ">= 0.11.10"

  backend "s3" {
    key            = "build-state/cache.tfstate"
    dynamodb_table = "terraform-locktable"
    region         = "eu-west-1"
    bucket         = "wellcomecollection-infra"
  }
}

# Make sure we're using AWS as provider
provider "aws" {
  version = "~> 1.56.0"
  region  = "us-east-1"
}

# Making the router state outputs available
# e.g. ${data.terraform_remote_state.router.alb_dns_name}
data "terraform_remote_state" "router" {
  backend = "s3"

  config {
    bucket = "wellcomecollection-infra"
    key    = "build-state/router.tfstate"
    region = "eu-west-1"
  }
}

# Lookup certificate to use ARN later on
data "aws_acm_certificate" "wellcomecollection_ssl_cert" {
  domain = "wellcomecollection.org"
}

# Lambda@Edge
data "aws_iam_policy_document" "lambda" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role" "edge_lambda_role" {
  name_prefix        = "edge_lambda"
  assume_role_policy = "${data.aws_iam_policy_document.lambda.json}"
}

data "aws_s3_bucket_object" "edge_lambda_origin" {
  bucket = "weco-lambdas"
  key    = "edge_lambda_origin.zip"
}

resource "aws_lambda_function" "edge_lambda_request" {
  function_name     = "cf_edge_lambda_request"
  role              = "${aws_iam_role.edge_lambda_role.arn}"
  runtime           = "nodejs8.10"
  handler           = "origin.request"
  s3_bucket         = "weco-lambdas"
  s3_key            = "edge_lambda_origin.zip"
  s3_object_version = "${data.aws_s3_bucket_object.edge_lambda_origin.version_id}"
  publish           = true
}

resource "aws_lambda_function" "edge_lambda_response" {
  function_name     = "cf_edge_lambda_response"
  role              = "${aws_iam_role.edge_lambda_role.arn}"
  runtime           = "nodejs8.10"
  handler           = "origin.response"
  s3_bucket         = "weco-lambdas"
  s3_key            = "edge_lambda_origin.zip"
  s3_object_version = "${data.aws_s3_bucket_object.edge_lambda_origin.version_id}"
  publish           = true
}

# /Lambda@Edge

# Create the CloudFront distribution
resource "aws_cloudfront_distribution" "devcache_wellcomecollection_org" {
  origin {
    domain_name = "${data.terraform_remote_state.router.alb_dns_name}"
    origin_id   = "origin"

    custom_origin_config {
      origin_protocol_policy = "https-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true

  aliases = [
    "devcache.wellcomecollection.org",
  ]

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
    viewer_protocol_policy = "redirect-to-https"
    target_origin_id       = "origin"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400

    forwarded_values {
      headers      = ["Host"]
      query_string = true

      query_string_cache_keys = [
        "page",
        "current",
        "query",
        "uri",
        "MIROPAC", # Wellcome Images redirect
        "MIRO",    # Wellcome Images redirect

        # dotmailer gives us a 'result' (if we run out of params,
        # consider making new urls for newsletter pages instead)
        "result",
      ]

      cookies {
        forward = "whitelist"

        whitelisted_names = [
          "toggles",  # feature toggles
          "toggle_*", # feature toggles
        ]
      }
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = "${aws_lambda_function.edge_lambda_request.qualified_arn}"
    }

    lambda_function_association {
      event_type = "origin-response"
      lambda_arn = "${aws_lambda_function.edge_lambda_response.qualified_arn}"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = "${data.aws_acm_certificate.wellcomecollection_ssl_cert.arn}"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  retain_on_delete = true
}
