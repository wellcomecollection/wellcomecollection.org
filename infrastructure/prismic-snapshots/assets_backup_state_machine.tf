# Step Functions State Machine for assets backup
resource "aws_sfn_state_machine" "assets_backup" {
  name     = "prismic-assets-backup"
  role_arn = aws_iam_role.assets_backup_state_machine_role.arn

  definition = jsonencode({
    Comment = "State machine to trigger backup and download Prismic assets"
    StartAt = "BackupTrigger"
    States = {
      BackupTrigger = {
        Type     = "Task"
        Resource = "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:backup_trigger"
        Comment  = "Returns batched assets: {items: [[batch1], [batch2], ...]}"
        Next     = "BackupDownload"
      }
      BackupDownload = {
        Type     = "Map"
        Comment  = "Processes each batch in parallel (max 10 concurrent batches)"
        ItemsPath = "$.items"
        MaxConcurrency = 10
        Iterator = {
          StartAt = "DownloadAssets"
          States = {
            DownloadAssets = {
              Type     = "Task"
              Resource = "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:backup_download"
              End      = true
            }
          }
        }
        Next = "Success"
      },
      Success = {
        Type = "Succeed"
      }
    }
  })
}

# IAM role for Step Functions state machine
resource "aws_iam_role" "assets_backup_state_machine_role" {
  name = "prismic-assets-backup-state-machine-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "states.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for Step Functions to invoke Lambda functions
resource "aws_iam_policy" "assets_backup_state_machine_policy" {
  name = "prismic-assets-backup-state-machine-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = [
          "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:backup_trigger",
          "arn:aws:lambda:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:function:backup_download"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "assets_backup_state_machine_policy" {
  role       = aws_iam_role.assets_backup_state_machine_role.name
  policy_arn = aws_iam_policy.assets_backup_state_machine_policy.arn
}

# Data sources for current AWS account and region
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
