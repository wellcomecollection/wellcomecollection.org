data "aws_iam_policy_document" "allow_ci_to_update_e2e_cluster" {
  statement {
    actions = ["ecs:UpdateService"]

    resources = [module.e2e.cluster_arn]
  }
}

resource "aws_iam_role_policy" "allow_ci_to_update_e2e_cluster" {
  role = "experience-ci"
  policy = data.aws_iam_policy_document.allow_ci_to_update_e2e_cluster.json
}

# CI deploys the beta test functions' code (.buildkite/scripts/deploy_beta_test_functions.sh).
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
