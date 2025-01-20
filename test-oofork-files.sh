#!/usr/bin/env bash

set -euo pipefail

TGZ_FILE=onlyoffice-editor.zip
CONTENT_FILE=content

assert_contains() {
    if ! grep --quiet --fixed-strings --line-regexp $1 < $CONTENT_FILE; then
        echo $1 not found in $TGZ_FILE
        exit 1
    fi
}

unzip -l $TGZ_FILE | sed -e 's/^[^a-z]*//' > $CONTENT_FILE

assert_contains web-apps/apps/api/documents/api.js
assert_contains web-apps/apps/api/documents/api-orig.js
assert_contains fonts/arial.ttf
assert_contains web-apps/vendor/requirejs/require.js
