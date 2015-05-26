#!/bin/bash

cd ../../
if [ "$TRAVIS" ]; then
  git clone "https://stellar-jenkins@github.com/stellar/js-stellar-base.git" js-stellar-base-gh-pages
else
  git clone git://github.com/stellar/js-stellar-base.git js-stellar-base-gh-pages
fi
cd js-stellar-base-gh-pages
git checkout origin/gh-pages
git checkout -b gh-pages
git branch --set-upstream-to=origin/gh-pages
cd ../js-stellar-base/website