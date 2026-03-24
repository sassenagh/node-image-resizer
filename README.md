# Node Image Resizer

![Node.js](https://img.shields.io/badge/Node.js-20_Alpine-346da3?style=flat)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-blueviolet)
![AWS](https://img.shields.io/badge/AWS-EKS%20%7C%20ECR-orange)
![Terraform](https://img.shields.io/badge/terraform-infrastructure-purple)
![ArgoCD](https://img.shields.io/badge/ArgoCD-GitOps-red)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

This project provides an API to upload images, queue them for processing, and asynchronously resize them using a worker service.

It follows a microservices architecture and is deployed on AWS using Kubernetes (EKS), with container images stored in ECR and continuous delivery managed by Argo CD.

Repository:  
https://github.com/sassenagh/node-image-resizer


---

# Architecture

```text
                +-------------+
                |   Client    |
                +-------------+
                       |
                       v
                +-------------+
                |    API      |
                | (Express)   |
                +-------------+
                       |
                       v
                +-------------+
                |   Redis     |
                |   (Queue)   |
                +-------------+
                       |
                       v
                +-------------+
                |   Worker    |
                | (Resize)    |
                +-------------+
                       |
                       v
                +-------------+
                |     S3      |
                |  (Storage)  |
                +-------------+

                ┌──────────────────────────────┐
                │        Kubernetes (EKS)      │
                │  Deployments + Services      │
                └──────────────────────────────┘

                ┌──────────────────────────────┐
                │          Argo CD             │
                │     GitOps Deployment        │
                └──────────────────────────────┘
```
Deployment workflow:

```
GitHub Actions → Docker (ECR) → ArgoCD → EKS
         ↓
   Terraform Infra → K8s Deployments
```

---

# Features

- Upload images via REST API
- Asynchronous processing using Redis queue
- Image resizing handled by background workers
- Storage in AWS S3
- Scalable architecture with Kubernetes
- GitOps deployment with Argo CD
- Fully containerized with Docker
- Secure configuration using Kubernetes Secrets
- Infrastructure managed with Terraform
- Automated testing with Jest & Supertest

---

# Tech Stack

## Backend
- Node.js
- Express
- Multer (file uploads)
- Sharp (image processing)
- Redis (queue system)

---

## Infrastructure
- AWS EKS (Kubernetes)
- AWS S3 (storage)
- AWS ECR (container registry)
- Terraform (IaC)

---

## Orchestration
- Kubernetes (Deployments, Services, Secrets)
- Horizontal scaling (replicas)

---

## CI/CD & GitOps
- GitHub Actions
- Argo CD

---

## Containerization
- Docker
- Docker Compose (local development)

---

## Testing
- Jest
- Supertest

---

# Project Structure

```
node-image-resizer/
├── api/                  # Express API
├── worker/               # Image processing worker
├── docker/               # Dockerfiles
├── infrastructure/
│   ├── k8s/              # Kubernetes manifests
│   └── terraform/        # AWS infrastructure
├── .github/workflows/    # CI/CD pipelines
└── README.md

```

---

# API Endpoints

## Health Checks

- `GET /health` → Liveness probe  
- `GET /ready` → Readiness probe  

---

## Image Processing

- `POST /image/resize`

Uploads an image and queues it for processing.

### Request

- Content-Type: `multipart/form-data`
- Field: `image`

### Response

```json
{
  "message": "Image queued",
  "id": "job-id"
}
```

---

# Running Locally

Clone the repository:

```bash
git clone https://github.com/sassenagh/node-image-resizer.git
cd node-image-resizer
```

Install dependencies:

```bash
npm install
```

Start Redis:

```bash
redis-server
```

Run the application:

```bash
npm start
```

Run the worker:

```bash
npm worker
```

The API will be available at:

```
http://localhost:3000
```

---

# Running with Docker

Build and start all services:

```bash
docker-compose up --build
```

Services included:
- API → http://localhost:3000
- Worker → background processing
- Redis → queue
- LocalStack → mock AWS services


Stop services:

```bash
docker-compose down
```

---

# Deployment

Infrastructure is provisioned with Terraform and deployed to AWS EKS.

Provision infrastructure:

```bash
terraform init
terraform apply
```

Deploy the application:

```bash
kubectl apply -f infrastructure/k8s
```

Check running pods:

```bash
kubectl get pods -n image-resizer-ns
```

---

# CI/CD Pipeline

The project uses GitHub Actions and Argo CD for deployment:

## CI (Continuous Integration)
- Runs on push and pull requests
- Installs dependencies
- Executes tests (Jest)

## CD (Continuous Deployment)
- Docker images are built when needed
- Images are pushed to AWS ECR

## GitOps (Argo CD)
- Watches the Kubernetes manifests in the repository
- Automatically syncs changes to EKS


# Notes
- Docker images are not rebuilt on every commit
- Infrastructure is managed separately with Terraform
- Argo CD ensures cluster state matches Git state

---

# License

MIT License