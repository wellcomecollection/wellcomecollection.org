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
