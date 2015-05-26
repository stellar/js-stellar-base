#!/bin/bash

set -e

cd ../../js-stellar-base-gh-pages
git checkout -- .
git clean -dfx
git fetch
git rebase
rm -Rf *
cd ../js-stellar-base/website
npm run-script docs
cp -R docs/* ../../js-stellar-base-gh-pages/
rm -Rf docs/
cd ../../js-stellar-base-gh-pages
git add --all
git commit -m "update website"
git push
cd ../js-stellar-base/website