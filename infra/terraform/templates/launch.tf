data "template_file" "launch_script" {
  template = "${var.launch_template}"

  vars {
    build_number = "${var.build_number}",
    build_bucket = "${var.build_bucket}",
    build_branch = "${var.build_branch}",
    project_name = "${var.project_name}"
  }
}

resource "aws_key_pair" "wellcomecollection" {
  key_name   = "${var.wellcomecollection_key_name}"
  public_key = "${file(var.wellcomecollection_key_path)}"
}

resource "aws_launch_configuration" "wellcomecollection" {
  name_prefix            = "wellcomecollection-instance-"
  key_name               = "${aws_key_pair.wellcomecollection.id}"
  image_id               = "${var.aws_node_ami}"
  instance_type          = "t2.micro"
  iam_instance_profile   = "${aws_iam_instance_profile.wellcomecollection.id}"
  user_data              = "${data.template_file.launch_script.rendered}"
  security_groups        = [
    "${aws_security_group.ssh_in.id}",
    "${aws_security_group.http.id}",
    "${aws_security_group.https.id}",
    "${aws_security_group.node_app_port.id}"
  ]

  connection { user = "ubuntu" }
  lifecycle { create_before_destroy = true }
}

resource "aws_iam_instance_profile" "wellcomecollection" {
  name = "wellcomecollection-app"
  roles = ["${aws_iam_role.wellcomecollection_instance.name}"]

  lifecycle { create_before_destroy = true }
}

resource "aws_autoscaling_group" "wellcomecollection_asg" {
  // We use the dynamic name from the ALC to ensure recreation
  name                      = "${var.project_name}-asg-${aws_launch_configuration.wellcomecollection.name}"
  max_size                  = 2
  min_size                  = 1
  wait_for_elb_capacity     = 1
  desired_capacity          = 1
  health_check_grace_period = 300
  health_check_type         = "ELB"
  launch_configuration      = "${aws_launch_configuration.wellcomecollection.id}"
  load_balancers            = ["${aws_elb.wellcomecollection.id}"]
  vpc_zone_identifier       = ["${aws_subnet.public.id}"]

  lifecycle { create_before_destroy = true }
}

# Launch through ECS
data "aws_ami" "ecs_optimized" {
  most_recent = true
  owners = ["amazon"]

  filter {
    name = "name"
    values = ["amzn-ami-*-amazon-ecs-optimized"]
  }
}

resource "aws_launch_configuration" "wellcomecollection_ecs" {
  name_prefix            = "wellcomecollection-ecs-instance-"
  key_name               = "${aws_key_pair.wellcomecollection.id}"
  image_id               = "${data.aws_ami.ecs_optimized.id}"
  instance_type          = "t2.micro"
  iam_instance_profile   = "${aws_iam_instance_profile.wellcomecollection.id}"
  security_groups        = [
    "${aws_security_group.ssh_in.id}",
    "${aws_security_group.http.id}",
    "${aws_security_group.https.id}",
    "${aws_security_group.node_app_port.id}"
  ]
  user_data = <<EOF
#!/bin/bash
echo ECS_CLUSTER=wellcomecollection >> /etc/ecs/ecs.config
EOF

  connection { user = "ubuntu" }
  lifecycle { create_before_destroy = true }
}

resource "aws_autoscaling_group" "wellcomecollection_ecs_asg" {
  name = "wellcomecollection-cluster-instances"
  min_size = 1
  max_size = 1
  launch_configuration = "${aws_launch_configuration.wellcomecollection_ecs.id}"
  vpc_zone_identifier  = ["${aws_subnet.public.id}"]
}
