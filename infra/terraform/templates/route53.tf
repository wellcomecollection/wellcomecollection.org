resource "aws_route53_zone" "internal" {
  name = "experience.internal."

  vpc {
    vpc_id = "${aws_vpc.wellcomecollection.id}"
  }
}
