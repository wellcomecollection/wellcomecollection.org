# EventBridge Scheduler for daily execution at 11 PM UTC
resource "aws_scheduler_schedule" "prismic_snapshot_daily" {
  name       = "${local.lambda_snapshot_name}-schedule"
  group_name = "default"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(0 23 * * ? *)" # 11 PM UTC daily

  target {
    arn      = aws_lambda_function.prismic_snapshot.arn
    role_arn = aws_iam_role.prismic_snapshot_scheduler_role.arn
  }
}

# Allow EventBridge Scheduler to invoke the Lambda
resource "aws_lambda_permission" "allow_scheduler" {
  statement_id  = "AllowExecutionFromScheduler"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.prismic_snapshot.function_name
  principal     = "scheduler.amazonaws.com"
  source_arn    = aws_scheduler_schedule.prismic_snapshot_daily.arn
}

resource "aws_iam_role_policy_attachment" "prismic_snapshot_scheduler_policy" {
  role       = aws_iam_role.prismic_snapshot_scheduler_role.name
  policy_arn = aws_iam_policy.prismic_snapshot_scheduler_policy.arn
}