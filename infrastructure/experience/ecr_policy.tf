locals {
  ecr_policy_expire_images_after_3_days = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire images after 3 days"
        selection = {
          tagStatus   = "any"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 3
        }
        action = {
          type = "expire"
        }
      }
    ]
  })

  ecr_policy_only_keep_the_last_100_images = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Only keep the last 100 images in a repo"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 100
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
