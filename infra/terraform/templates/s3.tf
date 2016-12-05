resource "aws_s3_bucket" "cardigan" {
    bucket = "cardigan.wellcomecollection.org"
    acl = "public-read"
    policy = "${file("website-policy.json")}"

    website {
        index_document = "index.html"
    }
}
