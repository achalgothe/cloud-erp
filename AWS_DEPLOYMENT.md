# Cloud ERP System - AWS Deployment Guide

## Architecture Overview

```
┌─────────────────┐
│  AWS CloudFront │ (CDN for Frontend)
└────────┬────────┘
         │
┌────────▼────────┐
│   AWS S3        │ (Static Frontend Hosting)
└────────┬────────┘
         │
┌────────▼────────┐
│  ALB/API Gateway│
└────────┬────────┘
         │
┌────────▼────────┐
│   AWS ECS/Fargate│ (Backend Containers)
└────────┬────────┘
         │
┌────────▼────────┐
│  MongoDB Atlas  │ (Database)
└─────────────────┘
```

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Domain name (optional)

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Get connection string
4. Whitelist IP: 0.0.0.0/0 (for production, use specific IPs)

## Step 2: Create S3 Bucket for Frontend

```bash
# Create bucket
aws s3 mb s3://cloud-erp-frontend-unique-name

# Configure for static website hosting
aws s3 website s3://cloud-erp-frontend-unique-name/ \
  --index-document index.html \
  --error-document index.html

# Upload frontend build
cd frontend
npm run build
aws s3 sync dist/ s3://cloud-erp-frontend-unique-name/
```

## Step 3: Create CloudFront Distribution

```bash
aws cloudfront create-distribution \
  --origin-domain-name cloud-erp-frontend-unique-name.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html
```

## Step 4: Setup ECS for Backend

### Create Task Definition

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json
```

### Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name cloud-erp-cluster
```

### Create Service

```bash
aws ecs create-service \
  --cluster cloud-erp-cluster \
  --service-name cloud-erp-backend \
  --task-definition cloud-erp-backend \
  --desired-count 2 \
  --launch-type FARGATE
```

## Step 5: Setup Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name cloud-erp-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-xxx

# Create target group
aws elbv2 create-target-group \
  --name cloud-erp-targets \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-xxx

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

## Step 6: Environment Variables

Update ECS task definition with environment variables:

```json
{
  "name": "NODE_ENV",
  "value": "production"
},
{
  "name": "MONGODB_URI",
  "value": "mongodb+srv://user:pass@cluster.mongodb.net/cloud-erp"
},
{
  "name": "JWT_SECRET",
  "value": "secure-random-string"
}
```

## Step 7: CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install and Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to S3
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_KEY }}
          aws-region: us-east-1
      
      - name: Sync to S3
        run: aws s3 sync frontend/dist/ s3://cloud-erp-frontend/
      
      - name: Invalidate CloudFront
        run: aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
      
      - name: Deploy Backend to ECS
        run: aws ecs update-service --cluster cloud-erp-cluster --service cloud-erp-backend --force-new-deployment
```

## Cost Estimation (Monthly)

| Service | Cost |
|---------|------|
| MongoDB Atlas (M10) | $57 |
| S3 + CloudFront | ~$5 |
| ECS Fargate (2 tasks) | ~$30 |
| ALB | ~$16 |
| **Total** | **~$108/month** |

## Security Best Practices

1. Use AWS Secrets Manager for sensitive data
2. Enable VPC for ECS tasks
3. Use Security Groups to restrict access
4. Enable CloudWatch logging
5. Set up AWS WAF for DDoS protection
6. Use HTTPS with ACM certificates
