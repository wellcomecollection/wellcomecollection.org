output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.prismic_snapshot.function_name
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket storing snapshots"
  value       = aws_s3_bucket.prismic_snapshots.bucket
}

output "lambda_function_url" {
  description = "AWS Console URL for the Lambda function"
  value       = "https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/${aws_lambda_function.prismic_snapshot.function_name}"
}

output "s3_bucket_url" {
  description = "AWS Console URL for the S3 bucket"
  value       = "https://s3.console.aws.amazon.com/s3/buckets/${aws_s3_bucket.prismic_snapshots.bucket}"
}

output "schedule_expression" {
  description = "When the snapshot runs"
  value       = aws_scheduler_schedule.prismic_snapshot_daily.schedule_expression
}
