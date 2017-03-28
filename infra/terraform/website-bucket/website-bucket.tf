variable "website_uri" {}

data "template_file" "website_policy" {
  template = "${file("../website-bucket/website-policy.json")}"

  vars {
    website_uri = "${var.website_uri}"
  }
}

resource "aws_s3_bucket" "website_bucket" {
  bucket = "${var.website_uri}"
  acl = "public-read"
  policy = "${data.template_file.website_policy.rendered}"

  website {
    index_document = "index.html"
  }
}
