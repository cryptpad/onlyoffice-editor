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

# Updating npm dependencies
After changing a `pachage.json` file you have to run this command to update the bazel dependencies:

```
bazel run -- @pnpm//:pnpm --dir $PWD install --lockfile-only
```
