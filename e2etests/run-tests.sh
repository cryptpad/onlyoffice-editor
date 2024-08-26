#!/usr/bin/env bash

set -euxo pipefail

# put node on the path
node_path=$(dirname "$1")
if [[ "$node_path" == external/* ]]; then
    node_path="${node_path:9}"
fi
PATH="$PWD/../$node_path:$PATH"

cd e2etests

npm exec -- playwright --help
exit 1
