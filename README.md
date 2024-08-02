# TODO

# Updating npm dependencies

```
bazel run -- @pnpm//:pnpm --dir $PWD install --lockfile-only
```

# Running all tests

```
bazel test --test_output=errors //...
```
