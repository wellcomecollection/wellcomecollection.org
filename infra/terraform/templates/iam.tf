resource "aws_iam_role" "wellcomecollection_instance" {
  name = "wellcomecollection-instance"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Principal": {"Service": "ec2.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }
}
EOF
}

resource "aws_iam_role_policy" "get_builds" {
  name = "get-builds"
  role = "${aws_iam_role.wellcomecollection_instance.id}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.build_bucket}/builds/*"
    }
  ]
}
EOF
}
