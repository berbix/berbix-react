#!/bin/bash

set -ex

VERSION=$(cat version)

sed -i "" -e "s/const SDK_VERSION = '[[:digit:]]*\.[[:digit:]]*\.[[:digit:]]*';/const SDK_VERSION = '$VERSION';/g" src/index.jsx
sed -i "" -e "s/  \"version\": \"[[:digit:]]*\.[[:digit:]]*\.[[:digit:]]*\",/  \"version\": \"$VERSION\",/g" package.json

git add package.json src/index.jsx version
git commit -m "Updating Berbix React SDK version to $VERSION"
git tag -a $VERSION -m "Version $VERSION"
git push --follow-tags

npm run build
npm publish
