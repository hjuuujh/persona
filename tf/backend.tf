# tfstate를 저장할 backend 설정
# s3먼저 생성한다음 설정해야 에러안남
terraform {
  backend "s3" {
    bucket = "persona-tf-state"
    key    = "terraform.state"
    region = "ap-northeast-2"
  }
}
