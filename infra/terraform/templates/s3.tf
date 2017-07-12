resource "aws_s3_bucket" "alb_log_bucket" {
  bucket = "${var.alb_log_bucket}"
}

data "aws_iam_policy_document" "alb_log_bucket_policy_document" {
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["s3:PutObject"]

    resources = [
      "${aws_s3_bucket.alb_log_bucket.arn}/${var.alb_log_prefix}/AWSLogs/*",
    ]

    principals {
      // Comes from here:
      // http://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#w28aac15b9c15b8c15b3b5b3
      identifiers = ["arn:aws:iam::156460612806:root"]

      type = "AWS"
    }
  }
}

resource "aws_s3_bucket_policy" "alb_log_bucket_policy" {
  bucket = "${aws_s3_bucket.alb_log_bucket.id}"
  policy = "${data.aws_iam_policy_document.alb_log_bucket_policy_document.json}"
}
