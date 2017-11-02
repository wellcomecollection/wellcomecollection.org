data "template_file" "website_policy" {
  template = "${file("${path.module}/s3-website-policy.json")}"

  vars {
    website_uri = "${var.website_uri}"
  }
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = "${var.website_uri}"
  acl    = "public-read"
  policy = "${data.template_file.website_policy.rendered}"

  website {
    index_document = "index.html"
  }

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}
