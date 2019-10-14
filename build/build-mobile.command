#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
cd $BASEDIR

PRODUCT_VERSION="5.3.4"
BUILD_NUMBER="7"
LAST_VERSION_TAG=$(git describe --abbrev=0 --tags)

version=$(echo $LAST_VERSION_TAG | sed -e "s/v//")
major=$(echo $version | cut -d. -f1)
minor=$(echo $version | cut -d. -f2)
maintenance=$(echo $version | cut -d. -f3)
build=$(echo $version | cut -d. -f4)

PRODUCT_VERSION="$major.$minor.$maintenance"
BUILD_NUMBER=$build

echo "----------------------------------------"
echo "Building for mobile"
echo "----------------------------------------"

# First argument is path to repository of iOS mobile. Use default if not setup

MOBILE_APP_PATH="$1"

if [ -z $MOBILE_APP_PATH ] ; then
    MOBILE_APP_PATH="../../mobile-apps"
fi

npm install

PRODUCT_VERSION=$PRODUCT_VERSION BUILD_NUMBER=$BUILD_NUMBER grunt --level=WHITESPACE_ONLY --mobile=true --formatting=PRETTY_PRINT

printf $'\r' > temp.txt

cat "../../web-apps-pro/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps-pro/vendor/underscore/underscore-min.js" "temp.txt" "../common/native/native.js" "temp.txt" "../common/native/wrappers/common.js" "temp.txt" "../common/native/jquery_native.js" "temp.txt" > "banners.js"

cat "banners.js" "../word/sdk-all-min.js" "../word/sdk-all.js" > $MOBILE_APP_PATH"/ios/Vendor/ONLYOFFICE/SDKData/documents/script.bin"

rm -f -r "banners.js"

cat "../../web-apps-pro/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps-pro/vendor/underscore/underscore-min.js" "temp.txt" "../common/native/native.js" "temp.txt" "../cell/native/common.js" "temp.txt" "../common/native/jquery_native.js" "temp.txt" > "banners.js"

cat "banners.js" "../cell/sdk-all-min.js" "../cell/sdk-all.js" > $MOBILE_APP_PATH"/ios/Vendor/ONLYOFFICE/SDKData/spreadsheets/script.bin"

rm -f -r "banners.js"

cat "../../web-apps-pro/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps-pro/vendor/underscore/underscore-min.js" "temp.txt" "../common/native/native.js" "temp.txt" "../common/native/wrappers/common.js" "temp.txt" "../common/native/jquery_native.js" "temp.txt" > "banners.js"

cat "banners.js" "../slide/sdk-all-min.js" "../slide/sdk-all.js" > $MOBILE_APP_PATH"/ios/Vendor/ONLYOFFICE/SDKData/presentations/script.bin"

rm -f -r "banners.js"
rm -f -r "temp.txt"

printf $PRODUCT_VERSION.$BUILD_NUMBER > $MOBILE_APP_PATH"/ios/Vendor/ONLYOFFICE/SDKData/documents/sdk.version"

printf $PRODUCT_VERSION.$BUILD_NUMBER > $MOBILE_APP_PATH"/ios/Vendor/ONLYOFFICE/SDKData/spreadsheets/sdk.version"

printf $PRODUCT_VERSION.$BUILD_NUMBER > $MOBILE_APP_PATH"/ios/Vendor/ONLYOFFICE/SDKData/presentations/sdk.version"
