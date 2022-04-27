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
mv config/index_production.js config/index.js
npm run build --mode=production
cd ..


echo
echo '### INSTALL API DEPENDENCIES ###'
# $dc run --rm spa npm run build --mode=production
cd api/
npm install
cd ..

echo
echo '### INSTALL CORRETOR DEPENDENCIES ###'
# $dc run --rm spa npm run build --mode=production
cd corretor/
npm install
mkdir -p temp
cd ..

echo
echo '### CREATING LOG FOLDERS ###'
mkdir -p logs/p_mongo/

echo
echo '### MOVE BUILD FOLDER ###'
mkdir -p env/prod/spa/dist/build
cp -rf spa/dist/* env/prod/spa/dist/build


echo
echo '### BUILD THE PROD ENV ###'
$dcp build

