#!/usr/bin/env bash

ids=$(aws cloudfront list-distributions --query "DistributionList.Items[*].Id" --output text);

for id in $ids; do 
  echo $id; 
done
