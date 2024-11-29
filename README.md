# TODO

# Build oofork.tar.gz

Run

```
bazel build :oofork
```

and find the result here: `bazel-bin/onlyoffice-editor.tar.gz`

# Running all tests

```
bazel test --test_output=errors //...
```

Screenshots of failed playwright tests are taken and put here: `bazel-testlogs/e2etests/playwright-test/test.outputs/outputs.zip`

# Updating npm dependencies
After changing a `pachage.json` file you have to run this command to update the bazel dependencies:

```
bazel run -- @pnpm//:pnpm --dir $PWD install --lockfile-only
```

# Diff changes we made to sdkjs and web-apps

## sdkjs

git fetch --depth=1 https://github.com/ONLYOFFICE/sdkjs.git v7.3.3.60
git diff FETCH_HEAD HEAD:sdkjs

## web-apps

git fetch --depth=1 https://github.com/ONLYOFFICE/web-apps.git v7.3.3.60
git diff FETCH_HEAD HEAD:web-apps

## diff UI

Instead of calling `git diff ...`, you can use `git difftool --dir-diff ...` with the same parameters, to see the diff in a UI.
