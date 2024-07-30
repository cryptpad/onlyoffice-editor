#!/usr/bin/env bash

set -euo pipefail

TGZ_FILE=onlyoffice-editor.tar.gz
CONTENT_FILE=content

assert_contains() {
    if ! grep --quiet --fixed-strings --line-regexp $1 < $CONTENT_FILE; then
        echo $1 not found in $TGZ_FILE
        exit 1
    fi
}

tar tfz $TGZ_FILE > $CONTENT_FILE

assert_contains web-apps/apps/api/documents/api.js
assert_contains web-apps/apps/api/documents/api-orig.js
assert_contains fonts/arial.ttf
