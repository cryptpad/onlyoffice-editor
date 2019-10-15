#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
cd $BASEDIR

PRODUCT_VERSION="5.4.1"
BUILD_NUMBER="1"
LAST_VERSION_TAG=$(git describe --abbrev=0 --tags)

version=$(echo $LAST_VERSION_TAG | sed -e "s/v//")
major=$(echo $version | cut -d. -f1)
minor=$(echo $version | cut -d. -f2)
maintenance=$(echo $version | cut -d. -f3)
build=$(echo $version | cut -d. -f4)

PRODUCT_VERSION="$major.$minor.$maintenance"
BUILD_NUMBER=$build


# Helpers

CreateDir() {
    if [ ! -d $1 ]; then
        mkdir -p $1
    else
        rm -Rf $1
        mkdir -p $1
    fi
}

CopyScriptTo() {
    if [ ! -d $1 ]; then
        echo "Create directory: $1"

        CreateDir $1"/documents"
        CreateDir $1"/spreadsheets"
        CreateDir $1"/presentations"
    fi
    
    printf $'\r' > temp.txt

    echo "Copy: word sdk-all.js"
    cat "../../web-apps-pro/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps-pro/vendor/underscore/underscore-min.js" "temp.txt" "../common/native/wrappers/common.js" "temp.txt" "../common/native/jquery_native.js" "temp.txt" > "banners.js"
    cat "banners.js" "../word/sdk-all-min.js" "../word/sdk-all.js" > $1"/documents/script.bin"
    rm -f -r "banners.js"

    echo "Copy: cell sdk-all.js"
    cat "../../web-apps-pro/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps-pro/vendor/underscore/underscore-min.js" "temp.txt" "../cell/native/common.js" "temp.txt" "../common/native/jquery_native.js" "temp.txt" > "banners.js"
    cat "banners.js" "../cell/sdk-all-min.js" "../cell/sdk-all.js" > $1"/spreadsheets/script.bin"
    rm -f -r "banners.js"

    echo "Copy: slide sdk-all.js"
    cat "../../web-apps-pro/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps-pro/vendor/underscore/underscore-min.js" "temp.txt" "../common/native/wrappers/common.js" "temp.txt" "../common/native/jquery_native.js" "temp.txt" > "banners.js"
    cat "banners.js" "../slide/sdk-all-min.js" "../slide/sdk-all.js" > $1"/presentations/script.bin"
    rm -f -r "banners.js"

    rm -f -r "temp.txt"

    echo "Copy: sdk version mark"
    printf $PRODUCT_VERSION.$BUILD_NUMBER > $1"/documents/sdk.version"
    printf $PRODUCT_VERSION.$BUILD_NUMBER > $1"/spreadsheets/sdk.version"
    printf $PRODUCT_VERSION.$BUILD_NUMBER > $1"/presentations/sdk.version"
}

echo "----------------------------------------"
echo "Prepare to compile"
echo "----------------------------------------"

npm install

echo "----------------------------------------"
echo "Compile SDKJS"
echo "----------------------------------------"

PRODUCT_VERSION=$PRODUCT_VERSION BUILD_NUMBER=$BUILD_NUMBER grunt --level=ADVANCED --mobile=true #--level=ADVANCED | WHITESPACE_ONLY

if [ -z "$1" ] ; then
    # iOS
    echo "----------------------------------------"
    echo "Copy SDKJS for iOS app"
    echo "----------------------------------------"
    CopyScriptTo "../../mobile-apps/ios/Vendor/ONLYOFFICE/SDKData"

    # Android
    echo "----------------------------------------"
    echo "Copy SDKJS for Android app"
    echo "----------------------------------------"
    CopyScriptTo "../../documents-android/extra-builds/native/libs/assets"
else
    # Custom path
    echo "----------------------------------------"
    echo "Copy SDKJS to custom path - $1"
    echo "----------------------------------------"
    CopyScriptTo "$1"
fi

echo "Done"
