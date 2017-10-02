resource "aws_iam_instance_profile" "wellcomecollection" {
  name  = "wellcomecollection-app"
  role = "${aws_iam_role.wellcomecollection_instance.name}"

  lifecycle {
    create_before_destroy = true
  }
}

# Launch through ECS
data "aws_ami" "ecs_optimized" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn-ami-*-amazon-ecs-optimized"]
  }
}

resource "aws_launch_configuration" "wellcomecollection_ecs" {
  name_prefix          = "wellcomecollection-ecs-instance-"
  key_name             = "wellcomecollection.org"
  image_id             = "${data.aws_ami.ecs_optimized.id}"
  instance_type        = "t2.medium"
  iam_instance_profile = "${aws_iam_instance_profile.wellcomecollection.id}"

  security_groups = [
    "${aws_security_group.ssh_in.id}",
    "${aws_security_group.http.id}",
    "${aws_security_group.https.id}",
    "${aws_security_group.node_app_port.id}",
    "${aws_security_group.docker.id}",
  ]

  user_data = <<EOF
#!/bin/bash
echo ECS_CLUSTER=wellcomecollection >> /etc/ecs/ecs.config
EOF

  connection {
    user = "ubuntu"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "wellcomecollection_ecs_asg" {
  name                 = "wellcomecollection-cluster-instances"
  desired_capacity     = 2
  min_size             = 2
  max_size             = 4
  health_check_type    = "EC2"
  launch_configuration = "${aws_launch_configuration.wellcomecollection_ecs.id}"
  vpc_zone_identifier  = ["${aws_subnet.public_a.id}", "${aws_subnet.public_b.id}"]
  target_group_arns    = ["${aws_alb_target_group.wellcomecollection.id}"]
}

output "ami_id" {
  value = "${data.aws_ami.ecs_optimized.id}"
}
