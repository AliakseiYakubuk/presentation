#!/usr/bin/env bash

source=$1
buckets=$2;

for bucket in $buckets; do 
  echo "Copy data to $bucket..."
  aws s3 cp s3://$source/ s3://$bucket/ --recursive
  sleep 1;
done

echo 'done'
