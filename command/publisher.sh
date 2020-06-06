#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
echo "trying to deploy $1!"
cd "$DIR/../repo/$1"
git pull origin master
rm package-lock.json
rm -rf node_modules
npm install
npm run build
