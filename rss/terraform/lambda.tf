data "aws_s3_object" "lambda_package" {
  bucket = "wellcomecollection-experience-infra"
  key    = "lambdas/stories_rss.zip"
}

resource "aws_lambda_function" "stories_rss" {
  function_name = "stories_rss_updater"
  description   = "Updates the copy of the RSS feed stored in S3"

  role    = aws_iam_role.stories_rss.arn
  runtime = "nodejs14.x"
  handler = "index.run"
  publish = true

  timeout = 60

  s3_bucket         = data.aws_s3_object.lambda_package.bucket
  s3_key            = data.aws_s3_object.lambda_package.key
  s3_object_version = data.aws_s3_object.lambda_package.version_id
}

resource "aws_iam_role" "stories_rss" {
  name_prefix        = "stories_rss"
  assume_role_policy = data.aws_iam_policy_document.lambda.json
}

resource "aws_iam_role_policy_attachment" "basic_execution_role" {
  role       = aws_iam_role.stories_rss.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "lambda" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"

      identifiers = [
        "lambda.amazonaws.com",
      ]
    }
  }
}
