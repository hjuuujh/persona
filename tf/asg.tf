# AMI Imaging을 통한 Auto Scaling용 Template 생성
# 설정이 완전한 인스턴스 대상으로 AMI Imaging
resource "aws_ami_from_instance" "app-layer-template-ami" {
  name               = "app-layer-template-ami"
  source_instance_id = aws_instance.app-private.id
  depends_on         = [aws_instance.app-private]
  # 인스턴스 명령어가 많이 입력되므로 완료된 후에 AMI Imaging 진행
  # 만약 테스트 시, 정상적으로 명령어가 프로비저닝이 안되었다면 time_sleep 리소스를 지정해서 대기 시간을 걸어야함
}

resource "aws_launch_template" "app-layer-launch-template" {
  name          = "app-layer-launch-template"
  image_id      = aws_ami_from_instance.app-layer-template-ami.id
  instance_type = "t3.micro"
  key_name      = var.key_pair_name

  vpc_security_group_ids = [aws_security_group.private-sg.id]
}

# Auto Scaling Group 생성
resource "aws_autoscaling_group" "app-layer-autoscaling-group" {
  name = "app-layer-autoscaling-group"
  launch_template {
    id      = aws_launch_template.app-layer-launch-template.id
    version = "$Latest"
  }
  vpc_zone_identifier = [aws_subnet.private-subnet.0.id, aws_subnet.private-subnet.1.id]

  desired_capacity          = 1 # Auto Scaling 그룹 초기 크기
  min_size                  = 1 # 부하에 따른 최소 인스턴스 수
  max_size                  = 3 # 부하에 따른 최대 인스턴스 수
  health_check_grace_period = 300
  health_check_type         = "ELB"

  target_group_arns = [aws_alb_target_group.frontend-80.arn]
  # ASG에서 생성된 인스턴스의 경우 위 방식으로 LoadBalancer TargetGroup에 등록 가능
  depends_on = [aws_alb_target_group.frontend-80]
  # LB Target Group이 생성되어 ARN이 지정된 후 위 명령어가 사용될 수 있기 때문에 Depends_on 사용

  tag {
    key                 = "Name"
    value               = "Persona App ASG"
    propagate_at_launch = true
  }
}

resource "aws_autoscaling_policy" "target-tracking-policy" {
  name                      = "asg-target-tracking-policy"
  autoscaling_group_name    = aws_autoscaling_group.app-layer-autoscaling-group.name
  policy_type               = "TargetTrackingScaling"
  estimated_instance_warmup = 10

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 30.0
  }
}
