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

data "archive_file" "ab_testing_zip" {
  type = "zip"
  output_path = "${path.module}/.dist/ab_tesing.zip"

  source {
    filename = "index.js"
    content = "${file("${path.module}/../webapp/ab_testing.js")}"
  }
}

data "archive_file" "redirector_zip" {
  type = "zip"
  output_path = "${path.module}/.dist/redirector.zip"

  source {
    filename = "index.js"
    content = "${file("${path.module}/../webapp/redirector.js")}"
  }

  source {
    filename = "redirects.js"
    content = "${file("${path.module}/../webapp/redirects.json")}"
  }
}

resource "aws_lambda_function" "ab_testing_request_lambda" {
  provider = "aws.us-east-1"
  function_name = "ab_testing_request"
  filename = "${data.archive_file.ab_testing_zip.output_path}"
  source_code_hash = "${data.archive_file.ab_testing_zip.output_base64sha256}"
  role = "${aws_iam_role.basic_lambda_role.arn}"
  runtime = "nodejs8.10"
  handler = "index.request"
  publish = true
}

resource "aws_lambda_function" "ab_testing_response_lambda" {
  provider = "aws.us-east-1"
  function_name = "ab_testing_response"
  filename = "${data.archive_file.ab_testing_zip.output_path}"
  source_code_hash = "${data.archive_file.ab_testing_zip.output_base64sha256}"
  role = "${aws_iam_role.basic_lambda_role.arn}"
  runtime = "nodejs8.10"
  handler = "index.response"
  publish = true
}

resource "aws_lambda_function" "redirector_lambda" {
  provider = "aws.us-east-1"
  function_name = "redirector"
  filename = "${data.archive_file.redirector_zip.output_path}"
  source_code_hash = "${data.archive_file.redirector_zip.output_base64sha256}"
  role = "${aws_iam_role.basic_lambda_role.arn}"
  runtime = "nodejs8.10"
  handler = "index.redirector"
  publish = true
}
