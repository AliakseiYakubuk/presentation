#!/usr/bin/env bash

set -e

urls=$1;
file='./src/public/sitemap.xml';
timestamp=$(date --iso-8601=seconds);

rm -f $file;
touch $file;
echo '<?xml version="1.0" encoding="UTF-8"?>' >> $file;
echo '\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' >> $file;

for url in $urls; do 
  echo "\n<url>\n<loc>$url</loc>\n<lastmod>$timestamp</lastmod>\n</url>" >> $file;
done

echo '\n</urlset>' >> $file;

echo 'sitemap is generated successfully';
