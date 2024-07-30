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

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
  ]
}

data "aws_s3_object" "edge_lambda_origin" {
  bucket = "weco-lambdas"
  key    = "edge_lambda_origin.zip"
}

resource "aws_lambda_function" "edge_lambda_request" {
  function_name     = "cf_edge_lambda_request"
  role              = aws_iam_role.edge_lambda_role.arn
  runtime           = "nodejs20.x"
  handler           = "origin.request"
  s3_bucket         = "weco-lambdas"
  s3_key            = "edge_lambda_origin.zip"
  s3_object_version = data.aws_s3_object.edge_lambda_origin.version_id
  publish           = true
}

resource "aws_lambda_function" "edge_lambda_response" {
  function_name     = "cf_edge_lambda_response"
  role              = aws_iam_role.edge_lambda_role.arn
  runtime           = "nodejs20.x"
  handler           = "origin.response"
  s3_bucket         = "weco-lambdas"
  s3_key            = "edge_lambda_origin.zip"
  s3_object_version = data.aws_s3_object.edge_lambda_origin.version_id
  publish           = true
}

