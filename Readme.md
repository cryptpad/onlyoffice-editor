[![License](https://img.shields.io/badge/License-GNU%20AGPL%20V3-green.svg?style=flat)](https://www.gnu.org/licenses/agpl-3.0.en.html)

# 🧩 Euro-Office JavaScript SDK (SDKJS)

SDKJS is the official JavaScript Software Development Kit (SDK) for Euro-Office document editing components.

JavaScript SDK provides the necessary **client-side APIs** for integrating and customizing the Euro-Office editors. It also includes an **implementation layer** for the Office JavaScript APIs, enabling advanced document manipulation and integration operations.

## 📁 Repository Structure Overview

The directory layout below helps developers quickly navigate and understand SDKJS directory purposes.

| Folder    | Description                                                                |
| :-------- | :------------------------------------------------------------------------- |
| `.github` | Contains GitHub workflows and issue/pr templates for CI/CD automation.     |
| `build`   | Scripts and configuration files used to build SDKJS bundles.               |
| `cell`    | Core functionality and UI logic for spreadsheet editor.                    |
| `common`  | Shared modules, utilities, and core logic used across all editor types.    |
| `configs` | Configuration files and constants used for environment and runtime setup.  |
| `pdf`     | Modules and UI components for viewing and annotating PDF files.            |
| `slide`   | Logic and rendering components for presentation editor.                    |
| `tests`   | Automated test suites and configs for validating SDKJS behavior.           |
| `tools`   | Helper utilities, build scripts, and developer tools.                      |
| `vendor`  | Third-party libraries and external dependencies used by SDKJS.             |
| `visio`   | Modules related to drawing and diagram editing (Visio-like functionality). |
| `word`    | Core logic and UI components for text document editor.                     |

## 🧪 Running tests

The test suites are QUnit pages run in headless Chromium via `node-qunit-puppeteer`.
They load the SDK from a `develop` build, so build that first, then run the suite.
The forms / oform suites need the [`sdkjs-forms`](https://github.com/Euro-Office/sdkjs-forms)
repository checked out as a sibling of this one (`../sdkjs-forms`).

```bash
# from the sdkjs/ directory, one-time setup
npm install grunt-cli node-qunit-puppeteer
npm install --prefix build
node node_modules/grunt-cli/bin/grunt --gruntfile build/Gruntfile.js develop --addon=sdkjs-forms

# run the whole suite (exits non-zero on failure)
node tests/runAll.js

# run a single suite: <test.html> <timeout-ms> "<puppeteer-args>"
node node_modules/node-qunit-puppeteer/cli.js tests/word/document-calculation/paragraph.html 30000 "--no-sandbox"
```

Concurrency defaults to 4 Chromium instances; override with `TESTS_CONCURRENCY`.
Suites that cannot pass in the standard build yet are listed (with reasons) in
`skippedTests` at the top of `tests/runAll.js`. CI runs these same steps via the
`unit-tests` job in `.github/workflows/check-build.yml`.

## 📜 License

**SDKJS** is licensed under the **GNU Affero General Public License (AGPL) v3.0**. For full details, refer to the [LICENSE](https://github.com/Euro-Office/sdkjs/blob/main/LICENSE.txt) file.
