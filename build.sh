#!/bin/bash

dc="docker-compose";
dcp="docker-compose -f docker-compose-prod.yml";

echo
echo '### INSTALL SPA DEPENDENCIES ###'
# $dc run --rm spa npm install
cd spa/
npm install
cd ..

echo
echo '### BUILD THE SPA DIST VERSION ###'
# $dc run --rm spa npm run build --mode=production
cd spa/
npm run build --mode=production
cd ..


echo
echo '### INSTALL API DEPENDENCIES ###'
# $dc run --rm spa npm run build --mode=production
cd api/
npm install
cd ..


echo
echo '### MOVE BUILD FOLDER ###'
mkdir -p env/prod/spa/dist/build
cp -rf spa/dist/* env/prod/spa/dist/build


echo
echo '### BUILD THE PROD ENV ###'
$dcp build

