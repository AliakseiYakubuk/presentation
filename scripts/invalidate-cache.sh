#!/usr/bin/env bash

ids=$(aws cloudfront list-distributions --query "DistributionList.Items[*].Id" --output text);

for id in $ids; do 
  echo "Invalidating $id..."
  aws cloudfront create-invalidation --distribution-id $id --paths "/*" 
  sleep 1;
done
