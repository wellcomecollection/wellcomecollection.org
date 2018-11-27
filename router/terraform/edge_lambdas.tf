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
    filename = "redirects.json"
    content = "${file("${path.module}/../webapp/redirects.json")}"
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
