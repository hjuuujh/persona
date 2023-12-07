# aws provider 설정
terraform {
  required_version = "~> 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.13.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

