resource "aws_cloudwatch_log_group" "cloudwatch_log_group" {
  name = "/aws/lambda/${var.name}"

  retention_in_days = var.log_retention_in_days
}

resource "aws_iam_role_policy" "cloudwatch_logs" {
  name   = "${aws_iam_role.iam_role.name}_lambda_cloudwatch_logs"
  role   = aws_iam_role.iam_role.name
  policy = data.aws_iam_policy_document.cloudwatch_logs.json
}

# TODO: Scope this more tightly
# https://github.com/wellcomecollection/wellcomecollection.org/issues/10266
data "aws_iam_policy_document" "cloudwatch_logs" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      "arn:aws:logs:*:*:*",
    ]
  }
}
