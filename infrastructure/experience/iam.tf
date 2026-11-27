data "aws_iam_policy_document" "allow_ci_to_update_e2e_cluster" {
  statement {
    actions = ["ecs:UpdateService"]

    resources = [module.e2e.cluster_arn]
  }
}

resource "aws_iam_role_policy" "allow_ci_to_update_e2e_cluster" {
  role   = "experience-ci"
  policy = data.aws_iam_policy_document.allow_ci_to_update_e2e_cluster.json
}

# CI builds and deploys the beta test functions' code (.buildkite/scripts/deploy_beta_test_functions.sh).
# Terraform in cache/ creates them and attaches them to distributions.
data "aws_iam_policy_document" "allow_ci_to_deploy_beta_test_functions" {
  statement {
    actions = [
      "cloudfront:DescribeFunction",
      "cloudfront:GetFunction",
      "cloudfront:UpdateFunction",
      "cloudfront:TestFunction",
      "cloudfront:PublishFunction",
    ]

    resources = ["arn:aws:cloudfront::130871440101:function/beta-tests-*"]
  }

  # Main uploads the compiled code here, and the deployment pipeline reads it
  statement {
    actions = ["s3:GetObject", "s3:PutObject"]

    resources = ["arn:aws:s3:::weco-lambdas/cloudfront_functions/*"]
  }

  # Lets the upload see which versions are already in the bucket
  statement {
    actions = ["s3:ListBucket"]

    resources = ["arn:aws:s3:::weco-lambdas"]

    condition {
      test     = "StringLike"
      variable = "s3:prefix"
      values   = ["cloudfront_functions/*"]
    }
  }

  # Updating a function keeps its KeyValueStore association, which CloudFront checks
  statement {
    actions = ["cloudfront:DescribeKeyValueStore"]

    resources = ["arn:aws:cloudfront::130871440101:key-value-store/*"]
  }
}

resource "aws_iam_role_policy" "allow_ci_to_deploy_beta_test_functions" {
  role   = "experience-ci"
  policy = data.aws_iam_policy_document.allow_ci_to_deploy_beta_test_functions.json
}
