module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  name               = var.cluster_name
  kubernetes_version = "1.33"

  cluster_create_endpoint_access = true
  cluster_endpoint_public_access_cidrs = ["0.0.0.0/0"]
  
  enable_irsa = true

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