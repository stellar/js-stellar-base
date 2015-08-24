#!/bin/bash

git clone "https://stellar-jenkins@github.com/stellar/bower-js-stellar-base.git" bower

echo 0

if [ ! -d "bower" ]; then
  echo "Error cloning"
  exit 1
fi

cp dist/* bower
echo 1
cd bower
echo 2
git add .
echo 3
git commit -m $TRAVIS_TAG
echo 4
git tag -a $TRAVIS_TAG -m $TRAVIS_TAG
echo 5
git push origin master --tags
echo 6
cd ..
echo 7
rm -rf bower
echo 8
