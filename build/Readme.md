This document describes the steps needed to build SDK.

For the full development environment setup, see the [fork/develop README](../../fork/develop/README.md).

1. Required software installation:
	- Download and install nodejs (https://nodejs.org/en/download/).
	- Download and install Java (http://java.com/en/download/index.jsp).

2. SDK build:
	- npm install -g grunt-cli
	- npm ci
	- grunt

3. Additional tasks:
	- `grunt develop` — generates develop scripts (scripts.js) pointing to individual source files (for debugging without compilation)
	- `grunt develop --compiled` — generates develop scripts pointing to compiled bundles (sdk-all-min.js)
	- `grunt --map` — copies source maps
