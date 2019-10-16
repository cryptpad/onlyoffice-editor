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

    DOCUMENTS_DIR=$1"/documents"
    SPREADSHEETS_DIR=$1"/spreadsheets"
    PRESENTATIONS_DIR=$1"/presentations"

    if [ ! -d $DOCUMENTS_DIR ]; then
        echo "Create directory: $DOCUMENTS_DIR"
        CreateDir $DOCUMENTS_DIR
    fi

    if [ ! -d $SPREADSHEETS_DIR ]; then
        echo "Create directory: $SPREADSHEETS_DIR"
        CreateDir $SPREADSHEETS_DIR
    fi

    if [ ! -d $PRESENTATIONS_DIR ]; then
        echo "Create directory: $PRESENTATIONS_DIR"
        CreateDir $PRESENTATIONS_DIR
    fi
    
    printf $'\r' > temp.txt

    echo "Copy: word sdk-all.js"
    cat "../../web-apps-pro/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps-pro/vendor/underscore/underscore-min.js" "temp.txt" "../common/Native/Wrappers/common.js" "temp.txt" "../common/Native/jquery_native.js" "temp.txt" > "banners.js"
    cat "banners.js" "../word/sdk-all-min.js" "../word/sdk-all.js" > $DOCUMENTS_DIR"/script.bin"
    rm -f -r "banners.js"

    echo "Copy: cell sdk-all.js"
    cat "../../web-apps-pro/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps-pro/vendor/underscore/underscore-min.js" "temp.txt" "../cell/native/common.js" "temp.txt" "../common/Native/jquery_native.js" "temp.txt" > "banners.js"
    cat "banners.js" "../cell/sdk-all-min.js" "../cell/sdk-all.js" > $SPREADSHEETS_DIR"/script.bin"
    rm -f -r "banners.js"

    echo "Copy: slide sdk-all.js"
    cat "../../web-apps-pro/vendor/xregexp/xregexp-all-min.js" "temp.txt" "../../web-apps-pro/vendor/underscore/underscore-min.js" "temp.txt" "../common/Native/Wrappers/common.js" "temp.txt" "../common/Native/jquery_native.js" "temp.txt" > "banners.js"
    cat "banners.js" "../slide/sdk-all-min.js" "../slide/sdk-all.js" > $PRESENTATIONS_DIR"/script.bin"
    rm -f -r "banners.js"

    rm -f -r "temp.txt"

    echo "Copy: sdk version mark"
    printf $PRODUCT_VERSION.$BUILD_NUMBER > $DOCUMENTS_DIR"/sdk.version"
    printf $PRODUCT_VERSION.$BUILD_NUMBER > $SPREADSHEETS_DIR"/sdk.version"
    printf $PRODUCT_VERSION.$BUILD_NUMBER > $PRESENTATIONS_DIR"/sdk.version"
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
    CopyScriptTo "../../documents-android/native/src/main/assets"
else
    # Custom path
    echo "----------------------------------------"
    echo "Copy SDKJS to custom path - $1"
    echo "----------------------------------------"
    CopyScriptTo "$1"
fi

echo "Done"
