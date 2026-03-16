#!/bin/sh
set -e

echo "Creating S3 bucket my-bucket..."
awslocal s3 mb s3://my-bucket
echo "Bucket my-bucket created successfully"