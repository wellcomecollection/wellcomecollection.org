data "aws_iam_policy_document" "lambda" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com",
        "edgelambda.amazonaws.com"
      ]
    }
  }
}

resource "aws_iam_role" "basic_lambda_role" {
  name_prefix = "basic_lambda"
  assume_role_policy = "${data.aws_iam_policy_document.lambda.json}"
}

resource "aws_iam_role_policy_attachment" "basic_lambda_execution" {
  role = "${aws_iam_role.basic_lambda_role.name}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "edge_lambda_zip" {
  type = "zip"
  output_path = "${path.module}/.dist/redirector.zip"

  source {
    filename = "origin.js"
    content = "${file("${path.module}/../webapp/origin.js")}"
  }

  source {
    filename = "ab_testing.js"
    content = "${file("${path.module}/../webapp/ab_testing.js")}"
  }

  source {
    filename = "redirector.js"
    content = "${file("${path.module}/../webapp/redirector.js")}"
  }

  source {
    filename = "redirects.js"
    content = "${file("${path.module}/../webapp/redirects.js")}"
  }

  source {
    filename = "wiRedirector.js"
    content = "${file("${path.module}/../webapp/wiRedirector.js")}"
  }
}

resource "aws_lambda_function" "edge_lambda_request" {
  provider = "aws.us-east-1"
  function_name = "edge_lambda_request"
  filename = "${data.archive_file.edge_lambda_zip.output_path}"
  source_code_hash = "${data.archive_file.edge_lambda_zip.output_base64sha256}"
  role = "${aws_iam_role.basic_lambda_role.arn}"
  runtime = "nodejs8.10"
  handler = "origin.request"
  publish = true
}

resource "aws_lambda_function" "edge_lambda_response" {
  provider = "aws.us-east-1"
  function_name = "edge_lambda_response"
  filename = "${data.archive_file.edge_lambda_zip.output_path}"
  source_code_hash = "${data.archive_file.edge_lambda_zip.output_base64sha256}"
  role = "${aws_iam_role.basic_lambda_role.arn}"
  runtime = "nodejs8.10"
  handler = "origin.response"
  publish = true
}

data "aws_s3_bucket_object" "edge_lambda_request" {
  provider = "aws.us-east-1"
  bucket = "weco-lambdas"
  key = "edge_lambda_origin.zip"
}

resource "aws_lambda_function" "edge_lambda_response_test" {
  provider = "aws.us-east-1"
  function_name = "edge_lambda_response_test"
  role = "${aws_iam_role.basic_lambda_role.arn}"
  runtime = "nodejs8.10"
  handler = "origin.response"
  s3_bucket = "weco-lambdas"
  s3_key = "edge_lambda_origin.zip"
  s3_object_version = "${data.aws_s3_bucket_object.edge_lambda_request.version_id}"
  publish = true
}
