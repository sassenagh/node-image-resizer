module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.15.1"

  name               = var.cluster_name
  kubernetes_version = "1.33"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

fargate_profiles = {
    default = {
      name = "image-resizer"
      selectors = [
        {
          namespace = "image-resizer-ns"
        }
      ]
    }
  }
}