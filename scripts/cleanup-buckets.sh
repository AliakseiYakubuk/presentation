#!/usr/bin/env bash

buckets=$1;

for bucket in $buckets; do 
  echo "Removing data in $id..."
  aws s3 rm s3://$bucket/ --recursive
  sleep 1;
done

echo 'done'
