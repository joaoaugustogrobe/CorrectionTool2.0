#!/bin/bash

dc="docker-compose";
dcp="docker-compose -f docker-compose-prod.yml";

# echo
# echo '### INSTALL SPA DEPENDENCIES ###'
# $dc run --rm spa npm install

echo
echo '### BUILD THE SPA DIST VERSION ###'
$dc run --rm spa npm cache clean --force
$dc run --rm spa npm run build --mode=production

# echo
# echo '### ENSURE THAT THE API BUILD FOLDER EXISTS ###'
# $dc run --rm api mkdir -p /var/dist/build