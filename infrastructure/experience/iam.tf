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

data "aws_iam_policy_document" "allow_ci_to_invalidate_cloudfront" {
  statement {
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetInvalidation"
    ]

    resources = [
      "arn:aws:cloudfront::130871440101:distribution/E24KUWI00L6FA3"
    ]
  }
}

resource "aws_iam_role_policy" "allow_ci_to_invalidate_cloudfront" {
  role   = "experience-ci"
  policy = data.aws_iam_policy_document.allow_ci_to_invalidate_cloudfront.json
}
