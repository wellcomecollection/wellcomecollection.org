resource "aws_vpc" "wellcomecollection" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags {
    Name = "wellcomecollection"
  }
}

resource "aws_internet_gateway" "wellcomecollection" {
  vpc_id = "${aws_vpc.wellcomecollection.id}"

  tags {
    Name = "wellcomecollection-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = "${aws_vpc.wellcomecollection.id}"

  tags {
    Name = "wellcomecollection-public"
  }
}

resource "aws_route" "public_internet_gateway" {
  route_table_id         = "${aws_route_table.public.id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.wellcomecollection.id}"
}

resource "aws_subnet" "public" {
  vpc_id                  = "${aws_vpc.wellcomecollection.id}"
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-west-1a"
  map_public_ip_on_launch = true

  tags {
    Name = "wellcomecollection-public"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = "${element(aws_subnet.public.*.id, count.index)}"
  route_table_id = "${aws_route_table.public.id}"
}
