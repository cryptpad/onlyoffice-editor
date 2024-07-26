#!/usr/bin/env bash

set -euxo pipefail

OUT_FILE=$1
WORK_DIR=$(mktemp -d -t build-oo.XXXXX)
START_PWD=`pwd`

cp -r --dereference sdkjs web-apps $WORK_DIR
cd $WORK_DIR/sdkjs
make
mv "$WORK_DIR/sdkjs/deploy/web-apps/apps/api/documents/api.js" "$WORK_DIR/sdkjs/deploy/web-apps/apps/api/documents/api-orig.js"
cd deploy
tar cf $START_PWD/$OUT_FILE .
