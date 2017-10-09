# TODO convert EOF strings to data
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

# ECS
resource "aws_iam_policy_attachment" "ecs_service_ec2_role" {
  # This is the default name used by amazon
  name       = "ecsInstanceRole"
  roles      = ["${aws_iam_role.wellcomecollection_instance.name}"]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_role" "ecs_service_role" {
  name               = "ecs-service-role"
  assume_role_policy = "${data.aws_iam_policy_document.ecs_service_role.json}"
}

data "aws_iam_policy_document" "ecs_service_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "ecs_service_policy" {
  name   = "ecs-service-policy"
  role   = "${aws_iam_role.ecs_service_role.id}"
  policy = "${data.aws_iam_policy_document.ecs_service_policy.json}"
}

data "aws_iam_policy_document" "ecs_service_policy" {
  statement {
    effect    = "Allow"
    resources = ["*"]

    actions = [
      "elasticloadbalancing:Describe*",
      "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
      "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
      "elasticloadbalancing:DeregisterTargets",
      "elasticloadbalancing:RegisterTargets",
      "ec2:Describe*",
      "ec2:AuthorizeSecurityGroupIngress",
    ]
  }
}

# Platform team ecs access delegation
resource "aws_iam_role" "platform_team_assume_role" {
  name = "platform-team-assume-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::${var.platform_team_account_id}:root"
    },
    "Action": "sts:AssumeRole"
  }
}
EOF
}

# Platform team grafana access delegation
resource "aws_iam_role" "platform_team_grafana_assume_role" {
  name = "platform-team-grafana-assume-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::${var.platform_team_account_id}:root"
    },
    "Action": "sts:AssumeRole"
  }
}
EOF
}

data "aws_iam_policy_document" "allow_ecs_admin" {
  statement {
    actions = [
      "ecs:*",
      "ecr:*",
    ]

    resources = [
      "*",
    ]
  }
}

data "aws_iam_policy_document" "allow_billing_usage_view" {
  statement {
    actions = [
      "aws-portal:ViewBilling",
      "aws-portal:ViewUsage",
    ]

    resources = [
      "*",
    ]
  }
}

resource "aws_iam_role_policy" "platform_team_ecs_admin" {
  name   = "platform_team_ecs_admin"
  role   = "${aws_iam_role.platform_team_assume_role.name}"
  policy = "${data.aws_iam_policy_document.allow_ecs_admin.json}"
}

resource "aws_iam_role_policy" "platform_team_grafana_billing" {
  name   = "platform_team_grafana_billing_view"
  role   = "${aws_iam_role.platform_team_grafana_assume_role.name}"
  policy = "${data.aws_iam_policy_document.allow_billing_usage_view.json}"
}
