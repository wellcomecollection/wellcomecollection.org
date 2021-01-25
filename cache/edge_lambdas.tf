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
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

data "aws_s3_bucket_object" "edge_lambda_origin" {
  bucket = "weco-lambdas"
  key    = "edge_lambda_origin.zip"
}

resource "aws_lambda_function" "edge_lambda" {
  for_each = toset(["request", "response"])

  function_name     = "cf_edge_lambda_${each.key}"
  role              = aws_iam_role.edge_lambda_role.arn
  runtime           = "nodejs12.x"
  handler           = "origin.${each.key}"
  s3_bucket         = "weco-lambdas"
  s3_key            = "edge_lambda_origin.zip"
  s3_object_version = data.aws_s3_bucket_object.edge_lambda_origin.version_id
  publish           = true
  environment {
    variables = {
      NODE_OPTIONS = "--enable-source-maps"
    }
  }
}

